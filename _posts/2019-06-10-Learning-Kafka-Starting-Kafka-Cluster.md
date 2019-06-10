---
layout: post
title:  "Learning Kafka - Installing Kafka, starting a Kafka Cluster & creating a Topic"
categories: blog
---

### Contents
- [Steps](#steps)
  - [Install Kafka](#install-kafka)
  - [Create a Kafka Cluster](#create-a-kafka-cluster)
    - [Start Zookeeper](#start-zookeeper)
    - [Start Kafka](#start-kafka)
  - [Create a Kafka Topic with 3 partitions and a replication factor of 1](#create-a-kafka-topic-with-3-partitions-and-a-replication-factor-of-1)
- [Reference](#reference)


## Steps

### Install Kafka

1. Download Kafka from [Kafka Apache Downloads](https://kafka.apache.org/downloads)

2. Extract Kafka in a directory `tar -xvf <filename-downloaded>` (eg. `/home/demouser/kafka/`)

3. Check if Kafka is working - Go to folder where you have extracted the downloaded Tar file and 
run `bin/kafka-topics.sh`

4. Add Kafka to Path

   1. Update `.bashrc`

      `export PATH="/home/demouser/kafka/kafka_2.12-2.2.0/bin:$PATH"`

   2. Update `.zshrc`

      `export PATH="/home/demouser/kafka/kafka_2.12-2.2.0/bin:$PATH"`

5. Check if Kafka is added to Path - Open a new terminal and run `kafka-topics.sh --version`

### Create a Kafka Cluster

#### Start Zookeeper

1. Go to Directory where you extracted the downloaded Tar file `/home/demouser/kafka/kafka_2.12-2.2.0/`

2. Create directory `data`

   1. Create directory `data/zookeeper`

3. Modify properties for Zookeeper

   1. `nano config/zookeeper.properties`

   2. Modify `dataDir=/home/demouser/kafka/kafka_2.12-2.2.0/data/zookeeper` to `zookeeper.properties`

   3. Save and Exit

4. Start Zookeeper

   1. Go to directory `/home/demouser/kafka/kafka_2.12-2.2.0`
   
   2. `zookeeper-server-start.sh config/zookeeper.properties`

   3. If Zookeeper starts successfully it'll bind to port 2181

#### Start Kafka

1. Go to Directory `/home/demouser/kafka/kafka_2.12-2.2.0/`

2. Create directory `data/kafka`

3. Modify properties for Kafka

   1. `nano config/server.properties`

   2. Modify `log.dirs=/home/divyanshu/kafka/kafka_2.12-2.2.0/data/kafka` to `server.properties`

   3. Save and Exit

4. Start Kafka

   1. Go to Directory `/home/demouser/kafka/kafka_2.12-2.2.0/`
   
   2. `kafka-server-start.sh config/server.properties` (Remember to keep Zookeeper running from the earlier step)

   3. If Kafka starts successfully we get a Kafka Started message

### Create a Kafka Topic with 3 partitions and a replication factor of 1

1. Go to Directory `/home/demouser/kafka/kafka_2.12-2.2.0/`

2. Create Kafka Topic - `kafka-topics.sh --zookeeper 127.0.0.1:2181 --topic first_topic --create --partitions 3 --replication-factor 1`

3. List info about a Kafka Topic - `kafka-topics.sh --zookeeper 127.0.0.1:2181 --topic first_topic --describe`


## Reference

1. [Course - Apache Kafka Series - Learn Apache Kafka for Beginners](https://www.udemy.com/apache-kafka)
2. [Course - Getting Started with Apache Kafka](https://www.pluralsight.com/courses/apache-kafka-getting-started)