---
layout: post
title:  "Learning Kafka - Configuring Kafka Producer for Message Durability"
categories: blog
---

The following post covers the common configuration parameters in Kafka Producer and Kafka Cluster to achieve message durability

### Contents
- [Message Durability](#message-durability)
  - [Setting up the Kafka Cluster & Topic](#setting-up-the-kafka-cluster--topic)
  - [Setting up the Kafka Producer](#setting-up-the-kafka-producer)

## Message Durability

Message Durability in Kafka is achieved via replication. When a message is published to the leader partition, it can be configured to be synchronously replicated across follower partitions. This ensures that if there is a crash on the broker holding the leader partition, a replica can fill in for the leader without data loss.

The following configurations need to be in place to achieve improved message durability

1. The Kafka Cluster should have multiple brokers (ideally on different machines) to allow for a replication factor greater than 1. The replication factor in Kafka is capped by the number of brokers. It is recommended to have a replication factor of 3 ie the Kafka cluster should operate with a minimum 3 brokers

2. `min.insync.replicas` - This configuration determines the number of partitions (including the leader partition) that a message should be published to synchronously.
   
   1. This configuration can be determined at the Broker or the Topic level. The configuration at the Topic level overrides definition at the Broker level
   
   2. If `min.insync.replicas` is set at 2, atleast one replica partition has to be alive for the leader partition to accomplish successful writes. This will ensure that the message is published on the leader and one replica partition before an acknowledgement is sent to the Kafka Producer

3. `acks` - This configuration parameter defines when the nature of acknowledgement for a message required by the Kafka Producer. It can be one of three values
   
   1. `0` - This represents the fire and forget state. The Kafka Producer fires off messages to the cluster and does not require any acknowledgements. This configuration provides high throughput but at the risk of data loss
   
   2. `1` - The Kafka Producer requires an acknowledgement when the leader partition has confirmed the write. While this improves data durability compared to `0`, there is still risk of data loss if the leader partition fails before the message could be replicated. This is also the default setting for `acks`
   
   3. `-1` or `all` - The Kafka Producer requires an acknowledgement when the message has been published to `min.insync.replicas`. This provides the highest degree of message durability in the face of faults and failures. This can however impact latency and throughput.

### Setting up the Kafka Cluster & Topic

**Creating a Kafka Cluster with 3 Brokers**

Follow instructions at [Kafka Docs - Setting up a multi-broker cluster](https://kafka.apache.org/quickstart#quickstart_multibroker)

Troubleshooting error `Configured broker.id 1 doesn't match stored broker.id 0 in meta.properties.`. 

This occurs when the `log.dirs` property for the `server-2.properties` and `server-1.properties` is the same as `server.properties.`. As a result the new broker tries to use the same log directory and since it uses the meta.properties created by broker 0 and has broker id as 0 it results in an error

**Creating a Kafka Topic with 3 Partitions, Replication factor of 3 and `min.insync.replicas` at 3**

Run the following command in the terminal

```
kafka-topics.sh --zookeeper 127.0.0.1:2181 \
--topic replicated_topic --create \
--partitions 3 \
--replication-factor 3 \
--config min.insync.replicas=3

```

To view the properties of the topic created

`kafka-topics.sh --zookeeper 127.0.0.1:2181 --topic replicated_topic --describe`

Output

```
Topic:replicated_topic	PartitionCount:3	ReplicationFactor:3	Configs:min.insync.replicas=3
	Topic: replicated_topic	Partition: 0	Leader: 1	Replicas: 1,0,2	Isr: 1,0,2
	Topic: replicated_topic	Partition: 1	Leader: 2	Replicas: 2,1,0	Isr: 2,1,0
	Topic: replicated_topic	Partition: 2	Leader: 0	Replicas: 0,2,1	Isr: 0,2,1

```

### Setting up the Kafka Producer

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/4d8c03a382e86e69cd73a193a3254d5ef4bde221)_

**Configuring `acks` to `all`**

```javascript
const producer = new Kafka.Producer({
  // ...Producer configuration
},
{ // Topic Configuration
  // Set the acknowledgement level for Kafka Producer
  'acks': 'all',
}
);

```

With the above configuration messages published to the `replicated_topic` would require confirmation from three replicas (including leader) before an acknowledgement is sent to the Kafka Producer.

On running the Kafka producer after shutting down one of the brokers, I get the follwing error

`Error: Broker: Not enough in-sync replicas`

Since this is a temporary error the Kafka Producer can be configured to retry using the following settings

```javascript
// Configure a Producer
const producer = new Kafka.Producer({
  // ...Producer configuration
  // Configure the max number of retries for temporary errors | Defaults to 2
  'message.send.max.retries': 100000,
  // Configure backoff time in ms before retrying a message | Defaults to 100 ms
  'retry.backoff.ms': 1000,
},
{ // Topic Configuration
  // Set the acknowledgement level for Kafka Producer
  'acks': 'all',
}
);
```

With the above configuration, the Producer retries sending the messages and if I restart the broker within the above limits, I get successful delivery reports for the messages

**Configuring `acks` to `1`**

On setting `acks` to `1`, only the leader is required to acknowledge the write to the Kafka Producer. 

In this scenario I was able to successfully publish messages to the Kafka Cluster and consume them via Kafka CLI consumer even when one of the brokers was shut down and `min.insync.replicas` was not satisfied.