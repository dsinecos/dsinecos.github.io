---
layout: post
title:  "Learning Kafka - Configuring Kafka Producer for Message Ordering"
categories: blog
---

The following post covers the common configuration parameters in Kafka Producer and Kafka Cluster to achieve message ordering

### Contents

- [Message Ordering in Kafka](#message-ordering-in-kafka)
- [Scenario in which message ordering can be disrupted](#scenario-in-which-message-ordering-can-be-disrupted)
- [Kafka Producer configuration to ensure Message Ordering](#kafka-producer-configuration-to-ensure-message-ordering)
- [Configuring Kafka Producer for message ordering](#configuring-kafka-producer-for-message-ordering)

## Message Ordering in Kafka

In Kafka message ordering is preserved only within a single partition. There is no order guarantee of messages across multiple partitions

## Scenario in which message ordering can be disrupted

When the Kafka Producer is configured to retry failed messages it is possible that message A which was sent first failed while message B which was sent after was published to the partition. Now since the Producer is configured to retry message A, when message A is successfully published to the partition, these two messages will appear out of order

## Kafka Producer configuration to ensure Message Ordering

For a non-zero setting of `message.send.max.retries` or `retries` it is crucial to set `max.in.flight.requests.per.connection` to 1. 

This setting ensures that there can only be one un-confirmed message in flight and if it fails, it can be retried before sending any later messages. This helps to ensure ordering among messages per partition

The disadvantage of setting `max.in.flight.requests.per.connection` to 1 is that it can adversely impact message throughput on Producer.

_For Kafka versions > 1.1 there is a `enable.idempotence` configuration setting which can achieve message ordering even with `max.in.flight.requests.per.connection` set to 5_

## Configuring Kafka Producer for message ordering

_[Browse Code on Github](https://github.com/dsinecos/learn-kafka-producer/tree/6e787d3ae9c5ab08270c09de16f1dda40229f0df)_

```javascript
const producer = new Kafka.Producer({
  // ...Producer configuration
  // Configure the max number of retries for temporary errors
  'message.send.max.retries': 100000,
  // Configure backoff time in ms before retrying a message
  'retry.backoff.ms': 1000,
  // Configure for consistent message ordering in the case of retries for failed messages
  'max.in.flight.requests.per.connection': 1
});

```