---
layout: post
title:  "Replication in MongoDB"
categories: blog
---

I completed a section on Architecture of ElasticSearch from an online [course](https://www.udemy.com/elasticsearch-complete-guide/learn/v4/content) and completed two chapters from MongoDB in Action - Replication and Scaling your system with sharding.

The motivation was to learn what these terms mean and what is their utility in application development. I'm writing this post to collate my notes and understanding from the above sources.

## What necessitates Replication and Sharding?

![availability-and-scalability](/assets/availability-and-scalability.svg)

## How replication adds to availability?

Replication involves storing multiple copies of data across nodes (different servers). 

In the event of a failure of the primary data source (node), the operational load of the database is shifted to the other nodes which are alive and retain a copy of the data from the primary data source

### replica-set in MongoDB

![replica-set-mongodb](/assets/replica-set-mongodb.svg)

- A replica-set in MongoDB consists of a group of nodes (primary, secondary and arbiter) which are configured to synchronize their data automatically
  
  - The primary node is used for the read and write operations.

  - The secondary nodes can also be configured for read operations. However write operations are carried out strictly by the primary node
  
  - An arbiter is added to a replica set if it has an equal number of nodes to allow the set to elect a new primary. Arbiters are lightweight mongod servers that participate in the election of the primary but don't replicate any of the data

- If the primary node goes offline, the remaining replica-set members (secondary and arbiter nodes)  go through a process by which they promote an existing secondary to primary to handle further database operations
  
  - However if a majority of the replica set is unavailable, the replica set cannot accept writes and all remaining members become read-only

  - In a replica-set, data isn't considered committed until it's been written to more than 50% of the nodes. If a replica set has thus only two nodes for a write operation to qualify for a commit, neither of the nodes can be down

## How is data synchronized between the primary and the secondary nodes of a replica set?

Every node (primary and secondary) has a database `local` where it stores all the replica-set metadata and an `oplog`

An `oplog` is a collection of entries where each entry corresponds to a write operation and contains enough information to reproduce the write operation. Also these entries in the `oplog` are idempotent - irrespective of how many times an oplog entry is applied, the result would be the same.

Each entry within an `oplog` contains
- Timestamp - In seconds since epoch when the operation occurred
- Operational code indicating the type of operation - insert, update or delete

Operations affecting multiple documents are split into multiple entries in the `oplog`. For multi-updates or mass deletes, a separate entry is created in the oplog for each document affected

## How a secondary node updates itself?
- Checks the timestamp of the latest entry in its oplog

- Queries primary's `oplog` for all entries later than the timestamp

- Adds each of those entries into its `oplog` and writes the correponding data

Secondary nodes use long polling ie make a long lived request to the primary. When the primary node is modified, it responds to the waiting request immediately. Thus, secondary nodes will usually be almost completely up to date 

The concept of an `oplog` and executing its entries to create the database sounded similar to how state is updated in redux. The equivalent of an entry in `oplog` is an action which is executed by the appropriate reducer to update the state. 

A key difference between actions in redux and the entries in an `oplog` is that the latter are idempotent. The idempotent nature of `oplog` entries allows them to be executed multiple times to overcome earlier failed attempts without fear of corrupting the data.

The `oplog` entries are also similar to commits in a version control system such as Git. By applying the commits, one can generate the code base at a given point in time.

## What are the challenges replication introduces?

- **Eventual consistency** - If the secondary nodes are being queried for data, there is a chance they might not return the latest version of the data. This is because all the writes are made to the primary node first and thereafter replicated in the secondary nodes. The delay incurred in updating the secondary node introduces eventual consistency.

- **Failure of automatic synchronization among the replica-set nodes** - The `oplog` is limited in size. Once the `oplog` fills up, older entries have to be removed as new entries are logged. The expectation is that all secondary nodes would find their state somewhere in the latest primary `oplog`. 
  
  If that is not the case, consider if the latest timestamp of a secondary node's `oplog` entry has been removed from the primary `oplog` a while back. In that case the secondary node will not be able to find its state in the primary `oplog` and automatic synchronization would fail.

  To restore the secondary node in this case would require manual intervention. Failure of automatic synchronization can occur due for the following reasons
  
  - The primary node's `oplog` size is too small
  
  - Write volumes on the primary node are too high
  
  - The size of the `oplog` and the expected write volumes on the primary node together define an upper bound on the downtime a secondary node can incur and still synchronize automatically. If the downtime for a secondary node exceeds this threshold automatic synchronization will fail.


- **Chances of a rollback** - There is a possibility that certain writes are made to the primary node but before they could be replicated to the secondary nodes, the primary node died. As a result, the replica-set will elect a new primary. 

  When the old primary comes online, its `oplog` will have certain entries inconsistent with the current primary. In such a scenario a rollback occurs and the respective entries and the corresponding data is removed from the old primary (now secondary).

  The reverted writes are stored in the rollback subdirectory of the old primary from where they can be restored manually if need be.

## How replication adds to performance?

Replication can help distribute read queries across secondary nodes with the caveat that the secondary nodes may not always serve the latest data (eventual consistency)

## References

- [ElasticSearch - Complete Guide](https://www.udemy.com/elasticsearch-complete-guide/learn/v4/content)
- [MongoDB in Action](https://www.manning.com/books/mongodb-in-action)
- [Replication Internals](https://www.kchodorow.com/blog/2010/10/12/replication-internals/)
- [Getting to know your oplog](https://www.kchodorow.com/blog/2010/10/14/getting-to-know-your-oplog/)

