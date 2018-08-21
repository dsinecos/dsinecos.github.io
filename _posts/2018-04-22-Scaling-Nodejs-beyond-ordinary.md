---
layout: post
title:  "[Reference] JS Conf Talk - Scaling Nodejs beyond ordinary"
categories: blog
---

I recently watched this talk [Scaling Nodejs beyond ordinary](https://www.youtube.com/watch?v=K8spO4hHMhg) made by Abhinav Rastogi at JSConf Iceland. 

The talk is given by the Lead UI Engineer of Flipkart, which is one of the leading e-commerce ventures in India. The talk goes into the challenges Flipkart faced while scaling their services and the various approaches that helped them out in the thick of it. 

Coming from a non CS background, I learnt a lot from watching this. I found it useful to get an overview of different concepts encountered when scaling applications. I likely got a good bit of it wrong but it was riveting nonetheless.

In this post I'm compiling my notes from watching this talk.

## Approach to Scaling/ Optimization cycle

![Approach to Scaling](/assets/Approach-to-Scaling.svg)

This encompasses the high level framework to approach scaling.

## Directions to scale

There are three directions to scale a system

1. Horizontal Scaling - This comprises adding more servers. This helps to introduce reliability and availability. The idea being that with multiple servers handling requests, failure of one would lead to routing of requests to other live servers. This might deteriorate performance but will prevent a complete black out of service.


2. Vertical Scaling - This involves adding more resources to the hardware you already have. The equivalent of adding more RAM and disk space to your server.


3. Application layer optimizations - This involves optimizations to better use the resources you already have. For instance, Nodejs being single threaded will use only a single core on a multi-core system. By using a process manager such as PM2 and running multiple processes of the node application, we can use all the available cores.

This talk focuses on the application layer optimizations to better harness the resources one already has.

## Which resources to profile?

The pre-cursor to optimization is profiling to identify the bottlenecks in the current system. The talk highlights which resources to profile, tools to profile the resources, the various bottlenecks they ran into and the approaches they took to fix those bottlenecks.

- ### Network
  
  1. Number of sockets that can be opened  - Opening a socket/ port/ connection on a Unix machine is equivalent to opening a file. This file in turn is represented by a file descriptor. And unix has an upper limit on the number of file descriptors that can be opened at any time.

     This can be found by using the command `ulimit a` which returns a response like the following

     ```
     -t: cpu time (seconds)              unlimited
     -f: file size (blocks)              unlimited
     -d: data seg size (kbytes)          unlimited
     -s: stack size (kbytes)             8192
     -c: core file size (blocks)         0
     -m: resident set size (kbytes)      unlimited
     -u: processes                       30800
     -n: file descriptors                1024
     -l: locked-in-memory size (kbytes)  64
     -v: address space (kbytes)          unlimited
     -x: file locks                      unlimited
     -i: pending signals                 30800
     -q: bytes in POSIX msg queues       819200
     -e: max nice                        0
     -r: max rt priority                 0
     -N 15:                              unlimited
     ```

     The limit for file descriptors is set at 1024 currently. This limit can be increased to allow for more sockets to be opened in parallel thus allowing more requests to be handled concurrently by the server.

  2. Reducing connection overhead to improve performance - Communication between various systems on the backend - application servers, load balancer, caching server, database server - can find a performance boost by using connection pools with `Keep Alive` header. 
     
     Such a connection pool would keep a set number of connections open between the machines for the duration specified by the `Keep Alive` header. This in turn will reduce the waiting time incurred during the three way handshake to establish the TCP connection. 
     
     When a request is made, an available connection from the connection pool would be used. Once the response is received the connection will be released and made avaiabled for other requests to use.

  3. Network bandwidth between different machines - application servers, load balancer, caching server, database server etc. 
     
     Consider a loadbalancer routing requests/responses to/from a 100 servers. And each server handles 100 requests/second sending a response payload of 1000kb in size. The load balancer would require a network bandwidth of 100 * 1000 kb/s or 100Mb/s to support the data flow.

- ### CPU

  1. Disabling dev environment tools in production - Dev environment can often have various debugging and monitoring tools running which can hog CPU resources and are not required in production. Disable them in production environment
  
  2. Profiling CPU usage - To identify which functions take up most of the CPU resources thus highlighting which functions need to be optimized for performance. [0x](https://www.npmjs.com/package/0x) is an npm module to generate flame graphs for node applications. 

  3. Targeting usage to 80% of the CPU processing power - This is to ensure that there is spare resource for other processes the operating system has to run and for nodejs' garbage collection. This can also provide a buffer to accommodate traffic bursts.


- ### Disk

  1. Avoid disk I/O in the hotpath. In such scenarios, try to cache resources where possible

  2. Avoid synchronous operations involving disk I/O


- ### Memory (RAM)
  
  1. [Memwatch](https://www.npmjs.com/package/memwatch) - Npm module to help detect memory leaks in Node applications


