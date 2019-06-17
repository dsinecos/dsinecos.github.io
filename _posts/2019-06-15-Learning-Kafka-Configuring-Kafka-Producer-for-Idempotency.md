---
layout: post
title:  "Learning Kafka - Configuring Kafka Producer for Idempotency"
categories: blog
---

The following post covers the common configuration parameters in Kafka Producer and Kafka Cluster to achieve idempotency

_Configuring Kafka Producer for idempotency involves various edge cases which should be considered. Refer [librdkafka - Idempotent Producer](https://github.com/edenhill/librdkafka/blob/master/INTRODUCTION.md#idempotent-producer) for more information_ 

### Contents
- [Message duplication due to Network Error](#message-duplication-due-to-network-error)
- [Idempotent Kafka Producer - Kafka Broker Setup](#idempotent-kafka-producer---kafka-broker-setup)
- [Configuring Kafka Producer for Idempotency](#configuring-kafka-producer-for-idempotency)
- [Reference](#reference)

## Message duplication due to Network Error

![kafka-producer-message-duplication](/assets/kafka-producer-message-duplication.svg)

## Idempotent Kafka Producer - Kafka Broker Setup

Kafka attaches a uniqueID to the messages being published which the Broker tests against before committing to its log. This prevents a message to be committed to the log twice due to network errors

![kafka-producer-idempotent](/assets/kafka-producer-idempotent.svg)

## Configuring Kafka Producer for Idempotency

For Kafka versions >1.1 an idempotent producer can be configured by setting the property `enable.idempotence` to `true` for the Kafka Producer.

`enable.idempotence =  true` sets the following configuration parameters

1. `retries = Integet.MAX_VALUE`

2. `max.in.flight.requests.per.connection = 5` (For Kafka>1.1)
   
3. `acks =  all`

_Note that for Kafka versions>1.1 enabling idempotence also sets the configuration parameters to achieve message ordering (even with `max.in.flight.requests.per.connection = 5`)_

_As of writing this post `node-rdkafka` does not support idempotent configuration for Kafka Producer and hence there are no code samples for this post_

## Reference

1. [librdkafka - Idempotent Producer](https://github.com/edenhill/librdkafka/blob/master/INTRODUCTION.md#idempotent-producer)