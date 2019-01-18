---
layout: post
title:  "Debugging ResourceRequest Timed out error in Sequelize"
categories: blog
---

While working on a project that involves building a small analytics platform using PostgreSQL, I ran into the `ResourceRequest timed out` error. I'm writing this post to summarize my debugging and the solution I've implemented for the time

- [Context](#context)
- [Debugging](#debugging)
  - [Hypothesis](#hypothesis)
  - [Approaches to resolve the issue](#approaches-to-resolve-the-issue)
  - [Comparing the approaches](#comparing-the-approaches)
- [Conclusion](#conclusion)

<br>
## Context

I ran into the error while sending thousands of concurrent database requests via Sequelize. The code ran without error if the number of concurrent requests were less than 1000. When I pushed the number to 10,000 I got the following error

`TimeoutError: ResourceRequest timed out`

<br>
## Debugging

I copied and pasted the error in Google and ended up at the following [issue thread](https://github.com/sequelize/sequelize/issues/7884) on Sequelize. Among the different reasons for the issue one was firing too many database requests concurrently

### Hypothesis

The connection pool setup using Sequelize had the following configuration

```javascript
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
    acquire: 20000
  }
```

Resulting in 
1. A connection pool with 5 reusable connections
2. A connection in the pool will be qualified as idle if it is unused for 10 seconds or more
3. The pool when invoked for a connection will wait a maximum of 20 seconds before throwing a Timeout error

Based on the pool configuration and the comments in the issue thread, I assumed that since I was firing thousands of requests concurrently, and each connection in the pool would only be released once the database query had completed, the requests fired later were hitting the 'acquire' timeout of 20 seconds and throwing `TimeoutError: ResourceRequest timed out`

![sequelize-debugging](/assets/sequelize-debugging.svg)

Based on the above hypothesis the timeout error will be a function of 
1. Time it takes for each database query to complete
2. Number of concurrent requests fired or number of requests waiting for a database connection from the pool
3. Maximum time each request would wait for a database connection before throwing a timeout error

### Approaches to resolve the issue

In this scenario, the database queries being made were similar and I assumed that therefore each request would take similar duration to complete and release the connection back to the pool

This left two approaches to resolve the issue
1. Increase the timeout
2. Limit the number of concurrent requests being fired

### Comparing the approaches

**Increase the 'acquire' timeout**

In this approach, the 'acquire' time will be a function of the number of concurrent requests fired. It will have to be adjusted such that the 'acquire' time is greater than the time it takes for 'x-1' requests to complete across a pool of 5 connections. 

`t > (x-1)/5 * T`

where 
- 'x' is number of concurrent requests made 
- 't' 'acquire' timeout
- 'T' - Time taken for each database query to complete

The disadvantage of this approach is that it depends on the number of concurrent requests made and if the program was to exceed that, it would run into the same error.

**Limit the number of concurrent requests made**

This approach involves batching together database requests such that no more than 'n' requests are fired concurrently. As requests complete more are added to this batch.

This approach allows to set the 'acquire' time as per the size 'n' of the batch.

I implemented this using the library [p-limit](https://www.npmjs.com/package/p-limit) which limits the number of concurrent promises.

<br>
## Conclusion

While the problem has been resolved by limiting the number of concurrent processes, it is contingent on the assumption that the database requests take near identical duration to complete. If that variability was to increase, the error 'ResourceRequest timed out' might resurface

