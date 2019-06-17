---
layout: post
title:  "Learning Kafka - Configuring Kafka Producer for High Throughput"
categories: blog
---

The following post covers the common configuration parameters in Kafka Producer to improve throughput via compression and batching

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/b8879523ab5ac30b616f6ba73e5808f2de2f5696)_

### Contents
- [Batching](#batching)
  - [Configuring Kafka Producer for Batching](#configuring-kafka-producer-for-batching)
- [Compression](#compression)
  - [Configuring Kafka Producer for Compression](#configuring-kafka-producer-for-compression)
- [Reference](#reference)

## Batching

Kafka Producer allows to batch messages before sending them to the Broker. This helps to reduce the network overhead incurred per message and improves throughput. The messages are batched per Topic-Partition before being sent out to the respective Broker.

There are two key configuration parameters to control batching in Kafka

1. `linger.ms`
   
   Defines the number of milliseconds the Kafka Producer is to wait before sending out a batch (for a Topic-Partition). When set to `0`, the messages are sent right away without batching

2. `batch.size`
   
   Defines the maximum size of a batch (per Topic-Partition). When the Kafka Producer hits this threshold, it sends out messages irrespective of whether `linger.ms` is satisfied or not. Likewise, if a message is greater than the `batch.size`, it is sent out immediately

### Configuring Kafka Producer for Batching

```javascript
const producer = new Kafka.Producer({
  // ...Producer Configuration
  // Configure waiting time before sending out a batch of messages
  'linger.ms': 200,
});

```

`librdkafka` has configuration parameters to determine the maximum number of messages in the Producer Queue (`queue.buffering.max.messages`) and the maximum size of the messages in the Producer queue (`queue.buffering.max.kbytes`) before it throws `QUEUE FULL` error. 

I was unable to clarify from the documentation if these parameters provide the same functionality as `batch.size` which is caps size on a Topic-Partition level and when the threshold is hit, it sends out the messages instead of throwing `QUEUE FULL` error

## Compression

Kafka Producer can be configured to use a compression type before sending out the messages. Enabling compression on the producer does not require any changes on the Broker.

A smaller message batch size improves throughput on the Kafka Producer and disk utilization on the Kafka Broker.

### Configuring Kafka Producer for Compression

```javascript
const producer = new Kafka.Producer({
  // ...Producer Configuration
  // Specify the compression type to be used for messages
  'compression.codec': 'snappy'
});

```

It is recommended to benchmark with different compression types and batching strategies to decide on the optimal for throughput

## Reference

1. [Udemy Course - Learn Apache Kafka for Beginners](https://www.udemy.com/apache-kafka/)