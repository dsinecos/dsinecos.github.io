---
layout: post
title:  "Networking devices - Which and why?"
categories: blog
---

I'm writing this post as I work through the course [Introduction to Computer Networks](https://www.udemy.com/introduction-to-computer-networks/learn/v4/content) summarizing the commonly used devices on a network and their uses

- [Hub](#hub)
- [Switch](#switch)
- [Wireless Access Point](#wireless-access-point)
- [Router](#router)
- [Firewall](#firewall)
- [DHCP server](#dhcp-server)
- [SOHO Device](#soho-device)

![network-diagram](/assets/network-diagram.svg)

## Hub
A Hub is used to connect devices together within a network. It is a Layer 1 device and operates by repeating any messages it receives on all its ports. This makes a Hub very inefficient and introduces congestion within the network

![network-diagram-hub](/assets/network-diagram-hub.svg)

## Switch
A Switch is used to connect devices together within a network. It is a Layer 2 device and uses the MAC address contained within a packet to decide which port to redirect it on.

A switch retains a mapping of its Port and the MAC address of the host connected to that Port. When it has to forward a message within the network it refers this mapping and forwards the message only to the relevant Port.

![network-diagram-switch](/assets/network-diagram-switch.svg)

A switch is capable of forwarding a message to all the ports if needed as in the case of a Broadcast message

If Switch A is connected to Switch B on one of its Ports, Switch A can store multiple MAC Addresses (of the various hosts connected to Switch B) against its single Port to forward relevant messages

![network-diagram-switch-to-switch](/assets/network-diagram-switch-to-switch.svg)

## Wireless Access Point
A Wireless Access Point is used to extend the Local Area Network to be accessible over Wi-Fi. 

A WAP device can connect to the router to via a wired network

## Router
A Router is used to route packets between networks using IP Addresses. It is a Layer 3 device.

It uses various routing protocols such as Distance Vector Protocols, Link State protocols to decide where to forward a packet

## Firewall
A Firewall prevents unwanted network traffic from accessing your network and vice-versa.

Firewalls can either be network device or software on a computer ie. either network based or host based

## DHCP server
A DHCP server or Dynamic Host Configuration Protocol is used to assign IP addresses dynamically to hosts within a network.

In addition to the IP Address, DHCP servers also provide the subnet mask, and the address for the default gateway when configuring a host connecting to the LAN

## SOHO Device
A Small Office Home Office device is the wireless router at home. It combines a number of functionalities such as

1. Router - Acts as default gateway connecting to the Internet
2. Firewall - To secure the LAN from unwanted network traffic
3. Switch - To provide communication within LAN
4. Wireless Access Point - To provide network connectivity over WiFi
5. DHCP server - To assign dynamic IPs to devices on LAN