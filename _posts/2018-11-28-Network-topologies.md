---
layout: post
title:  "Network Topologies"
categories: blog
---

I'm writing this post to summarize my understanding of some of the common network topologies and their pros and cons.

### Index
- [What is Network Topology?](#what-is-network-topology)
- [Overview of different Physical network topologies](#overview-of-different-physical-network-topologies)
    - [Star Topology](#star-topology)
    - [Mesh Topology](#mesh-topology)
    - [Point to Point Topology](#point-to-point-topology)

<br>

## What is Network Topology?
A network topology specifies the layout of the machines connected in a network.

There are two types of network topologies

1. Physical network topology - This determines the physical layout and connectivity of devices within a network

2. Logical network topology - This determines how signal flows from one device to another within a network. A network can have different physical and logical network topologies

<br>

## Overview of different Physical network topologies

Different network topologies offer different levels of redundancy, fault tolerance and vary on cost and ease of implementation and maintenance.

### Star Topology

In a star topology all devices are connected to a central device ( a hub or a switch).

![star-topology](/assets/star-topology.svg)

Failure of a single host on a star topology does not affect other hosts. However failure of the central device can bring down the network among all hosts

This topology is often used in small networks eg. the small office home office network

### Mesh Topology

In a mesh topology each device is connected to every other device on the network via a separate cable

![mesh-topology](/assets/mesh-topology.svg)

Mesh Topology provides high redundancy and fault tolerance at the cost of increased cabling

### Point to Point Topology

Point to Point topology provides a one to one connection between the devices. Point to point topology does not offer redundancy

![point-to-point-topology](/assets/point-to-point-topology.svg)
