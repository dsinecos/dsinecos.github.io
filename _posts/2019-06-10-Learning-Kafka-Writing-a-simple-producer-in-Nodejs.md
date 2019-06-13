---
layout: post
title:  "Learning Kafka - Writing a simple Kafka Producer in Node.js"
categories: blog
---

This post covers using [node-rdkafka](https://github.com/Blizzard/node-rdkafka) library for writing Kafka Producers.

_Refer [Learning Kafka - Installing Kafka, starting a Kafka Cluster & creating a Topic](https://dsinecos.github.io/blog/Learning-Kafka-Starting-Kafka-Cluster) for setting up the pre-requisites for the following blog post_

### Contents
- [Setup Kafka Client for Node.js](#setup-kafka-client-for-nodejs)
- [Create a Kafka Topic using Kafka CLI](#create-a-kafka-topic-using-kafka-cli)
- [Writing Kafka Producer](#writing-kafka-producer)
  - [Setup a Higher Level Kafka Producer](#setup-a-higher-level-kafka-producer)
  - [Setup a Kafka Producer & receive delivery reports via polling](#setup-a-kafka-producer--receive-delivery-reports-via-polling)
  - [Add Error monitoring to the Kafka Producer](#add-error-monitoring-to-the-kafka-producer)
  - [Enable Logging to view `librdkafka` logs](#enable-logging-to-view-librdkafka-logs)
  - [Using `producer.flush()`](#using-producerflush)
- [Reference](#reference)

## Setup Kafka Client for Node.js

Using the client [node-rdkafka](https://github.com/Blizzard/node-rdkafka), Node.js wrapper for Kafka C/C++ library

Create `index.js`

```javascript
const Kafka = require('node-rdkafka');
const debug = require('debug')('kafka:producer');

debug(`Supported features ${Kafka.features}`);
debug(`librdkafka version ${Kafka.librdkafkaVersion}`);

```

## Create a Kafka Topic using Kafka CLI

After you've setup Zookeeper, Kafka and Kafka-CLI run the following on the terminal

`kafka-topics.sh --zookeeper 127.0.0.1:2181 --topic first_topic --create --partitions 3 --replication-factor 1`

To create a topic 'first_topic' with 3 partitions and a replication factor of 1

## Writing Kafka Producer

### Setup a Higher Level Kafka Producer

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/5fb0e7e6f0b0cfe55d5841ba054d1fcc36ab7c17)_

The first version implements a Higher Level Kafka Producer which publishes 5 messages to the respective Topic Partitions and logs their offset

I've added comments to explain the code's execution and flow

```javascript
const Kafka = require('node-rdkafka');
const debug = require('debug')('kafka:producer');

// To list the features supported by node-rdkafka
debug(`Supported features ${Kafka.features}`);
// To retrieve the version of librdkafka that node-rdkafka is based on
debug(`librdkafka version ${Kafka.librdkafkaVersion}`);

// Configure a Producer
const producer = new Kafka.HighLevelProducer({
  // Allows to correlate requests on the broker with the respective Producer
  'client.id': "demo-producer",
  // Bootstrap server is used to fetch the full set of brokers from the cluster &
  // relevant metadata
  'bootstrap.servers': 'localhost:9092', // OR 'metadata.broker.list': 'localhost:9092'
});

// Topic has been already created using Kafka CLI
// Create Topic on Kafka Cluster
const topicName = 'first_topic';

// The 'ready' event is emitted when the Producer is ready to send messages
producer.on('ready', function (arg) {

  debug('Producer ready. ' + JSON.stringify(arg, null, '  '));

  // Log Metadata once Producer connects to Kafka Cluster
  const opts = {
    // Topic for which metadata is to be retrieved
    topic: 'first_topic',
    // Max time, in ms, to try to fetch metadata before timing out. Defaults to 3000
    timeout: 10000
  };

  producer.getMetadata(opts, function (err, metadata) {
    if (err) {
      debug('Error fetching metadata');
      debug(err);
      return;
    }
    debug('Received metadata');
    debug(metadata);
  });

  let maxMessages = 5

  // Iterate and Publish 10 Messages to the Kafka Topic
  for (let i = 1; i <= maxMessages; i++) {
    
    // Message to be sent must be a Buffer
    let value = Buffer.from('value-' + i);
    
    // The partitioners shipped with Kafka guarantee that all messages with the same non-empty
    // key will be sent to the same partition. If no key is provided, then the partition is 
    // selected in a round-robin fashion to ensure an even distribution across the topic 
    // partitions
    let key = "key-" + i;
    
    // If a partition is set, the messages will be routed to the defined Topic-Partition
    // If partition is set to -1, librdkafka will use the default partitioner
    let partition = -1;
    
    // If the Broker version supports adding a timestamp, it'll be added
    let timestamp = Date.now();

    producer.produce(
      topicName, 
      null, // Partition is set to null, 
      value, 
      null, // Key is set to null resulting in a Round-Robin distribution of messages
      timestamp, 
      (err, offset) => { // Callback to receive delivery reports for messages
      if (err) {
        debug('Error producing message');
        debug(err)
      }

      debug(`Offset: \n ${offset}`) // Offset of the committed message is logged
    });
  }
});

// Connecting the producer to the Kafka Cluster
producer.connect({}, (err) => {
  if (err) {
    debug('Error connecting to Broker');
    debug(err);
    return;
  }
  debug('Connected to broker');
});
```

The `producer.produce()` call sends messages to the Kafka Broker asynchronously. It writes the messages to a queue in `librdkafka` synchronously and returns. Within `librdkafka` the messages undergo micro-batching (for improved performance) before being sent to the Kafka cluster. Once delivered the callback is invoked with the delivery report for the message 

### Setup a Kafka Producer & receive delivery reports via polling

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/04a2d70157399fdcce4077242c87855ac86d83b5)_

In this version we'll implement a Kafka Producer and fetch delivery reports for the messages via polling

**Switching to a Kafka Producer and enabling delivery reports**

```javascript
const producer = new Kafka.Producer({
  // Allows to correlate requests on the broker with the respective Producer
  'client.id': "demo-producer",
  // Bootstrap server is used to fetch the full set of brokers from the cluster &
  // relevant metadata
  'bootstrap.servers': 'localhost:9092', // OR 'metadata.broker.list': 'localhost:9092'
  // Enable to receive delivery reports for messages
  'dr_cb': true,
  // Enable to receive message payload in delivery reports
  'dr_msg_cb': true,
});

```

**Listening and Polling for delivery reports**

```javascript
// Setup listener to receive delivery-reports
producer.on('delivery-report', (err, report) => {
  if (err) {
    debug('Error delivering messaage');
    debug(err)
    return;
  }

  debug(`Delivery-report: ${JSON.stringify(report, null, '  ')}`);
})

// To receive delivery reports the producer needs to be polled at regular intervals
// Configures polling the producer for delivery reports every 1000 ms
producer.setPollInterval(1000);
// producer.setPollInterval(0) to disable polling

```

**Modifying the produce function & adding an opaque token**

```javascript
// Opaque token gets passed to the delivery reports and can be used to
// correlate messages against their respective delivery reports
let opaqueToken = `opaque::${i}`

producer.produce(
  topicName,
  null, // Partition is set to null, 
  value,
  null, // Key is set to null resulting in a Round-Robin distribution of messages
  timestamp,
  opaqueToken
);
```

Similar to the earlier version, the `producer.produce()` sends messages asynchronously. The delivery reports for the messages are received and queued by `librdkafka`. When `producer.poll()` is invoked (either directly or via `producer.setPollInterval(1000)`) the listener for delivery reports is invoked once for each message.

`librdkafka` Documentation provides a list of callbacks that are triggered by invoking `poll` [2]

**Output from Kafka Producer**

```
kafka:producer Supported features gzip,snappy,sasl,regex,lz4,sasl_plain,plugins +0ms
kafka:producer librdkafka version 1.0.0-pre2 +2ms
kafka:producer Producer ready. {
kafka:producer   "name": "demo-producer#producer-1"
kafka:producer } +6ms
kafka:producer Connected to broker +1ms
kafka:producer Received metadata +3ms
kafka:producer { orig_broker_id: 0,
kafka:producer   orig_broker_name: 'localhost:9092/0',
kafka:producer   topics: 
kafka:producer    [ { name: 'first_topic', partitions: [Array] },
kafka:producer      { name: '__consumer_offsets', partitions: [Array] } ],
kafka:producer   brokers: [ { id: 0, host: 'localhost', port: 9092 } ] } +0ms

```

Sample Delivery report

```
kafka:producer Delivery-report: {
kafka:producer   "topic": "first_topic",
kafka:producer   "partition": 1,
kafka:producer   "offset": 334,
kafka:producer   "key": null,
kafka:producer   "opaque": "opaque::1",
kafka:producer   "timestamp": 1560403372230,
kafka:producer   "value": {
kafka:producer     "type": "Buffer",
kafka:producer     "data": [
kafka:producer       118,
kafka:producer       97,
kafka:producer       108,
kafka:producer       117,
kafka:producer       101,
kafka:producer       45,
kafka:producer       49
kafka:producer     ]
kafka:producer   },

```

### Add Error monitoring to the Kafka Producer

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/6e3d6f829c80f49de1ca444a7a727bba79d6df40)_

```javascript

// Setup listener to receive errors
producer.on('event.error', (err) => {
  debug('Error');
  debug(err);
})

```

`librdkafka` the underlying library around which `node-rdkafka` wraps outlines the following approach for handling errors within the Producer [1] [3]

> If the error is retryable and there are remaining retry attempts for the given message(s), an automatic retry will be scheduled by `librdkafka`, these retries are not visible to the application

> Only permanent errors and temporary errors that have reached their maximum retry count will generate a delivery report event to the application with an error code set

As per `librdkafka`'s documentation [2] for the `event.error` listener to be invoked, the `poll` method needs to be called at regular intervals


### Enable Logging to view `librdkafka` logs

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/e6e5ed35b0e32725c19d123a9e220f4b89d7a73d)_

Logs can be enabled for easier and improved debugging of the behavior of the Kafka Producer

**Modify Producer configuration**

```javascript
const producer = new Kafka.Producer({
  // ...adding to the earlier configuration
  // Enable to receive events from `librdkafka`
  'event_cb': true,
  // Enable to receive logs from `librdkafka`
  'debug': ['all'],
});

```

**Adding listener for logs**

```javascript
// Setup listener to receive logs
producer.on('event.log', (log) => {
  debug('Log received');
  debug(log)
})

```

As per `librdkafka` documentation [2] the listeners for logs are not triggered by `poll()` can be called spontaneously at any time to output log messages generated by librdkafka 

### Using `producer.flush()`

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/dafdf1eba062e6395030e1b7105215b00fd31aa5)_

`producer.flush(timeout, cb)` is used to flush the `librdkafka` internal queue and send all the messages.

1. `producer.flush()` is a non-blocking function

2. If the delivery report for the messages are recieved within `timeout` the respective listener for `delivery-report` will be invoked (a call to `poll()` is not necessary in this scenario)

3. The `timeout` parameter determines how long `producer.flush()` will wait to receive the delivery reports for the messages before raising an error

4. If the delivery reports for the messages are not received within the `timeout`, the `cb` function is invoked with an error `Error: Local: Timed out`

**Using `producer.flush` with `linger.ms`**

`linger.ms` dictates how long a producer should wait to batch up messages before sending them to Kafka cluster. 

If `producer.flush()` has a timeout less than `linger.ms` it is likely to throw an error.

It is important to note that each `producer.flush()` call blocks up one libuv thread each. If there are 4 libuv threads and 8 `producer.flush()` calls have been made with 2000ms timeout. The first 4 `producer.flush()` calls will execute as expected, timing out after 2000ms. This will free up the 4 libuv threads and allow the next 4 `producer.flush()` calls to take them up. As a result these 4 `producer.flush()` calls will timeout after 4000ms from the start. 

This can be observed by modifying
- `linger.ms`
- `process.env.UV_THREADPOOL_SIZE`
- `timeout` - For `producer.flush()`

## Reference

1. [Producer message delivery failure](https://github.com/edenhill/librdkafka/blob/master/INTRODUCTION.md#producer-message-delivery-failure)

2. [Threads and callbacks](https://github.com/edenhill/librdkafka/blob/master/INTRODUCTION.md#threads-and-callbacks)

3. [Error handling and propagation - `librdkafka`](https://github.com/edenhill/librdkafka/wiki/Error-handling)

4. [Course - Apache Kafka Series - Learn Apache Kafka for Beginners](https://www.udemy.com/apache-kafka) 

5. [Configuration Options for Kafka Producer and Consumer - `librdkafka`](https://github.com/edenhill/librdkafka/blob/v0.11.6/CONFIGURATION.md)

6. [Producer API - python-rdkafka](https://docs.confluent.io/current/clients/confluent-kafka-python/index.html#producer)