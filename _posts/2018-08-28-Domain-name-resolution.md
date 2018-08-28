---
layout: post
title:  "How domain name is resolved to an IP address?"
categories: blog
---

I'd like to understand the high level steps that occur between typing a URL and having it rendered on the browser. I'm writing this post to cover the steps that occur to resolving a URL to its IP address. 

## What's in a Domain name?

![What's in a Domain name?](/assets/domain-name.svg)

## Resolving a Domain Name to its IP Address

![Domain name resolution](/assets/resolving-a-domain-name.svg)

## Steps

1. When you type a URL (say `www.dnsexample.com`) in the address bar and press enter, the browser first checks locally on the machine to retrieve the IP address for that URL

2. If the above fails the next hop is at a Resolving Name Server. 
   - Resolving name servers can be understood as intermediaries which make subsequent requests to fetch the IP address from the name servers and return it to the client. They ease the querying burden from the client machine. Resolving name servers are usually provided by the ISP

   - The resolving name server looks in its cache and if unsuccessful, proceeds with the following steps

3. A query is made to the Root server. A root server returns the address for the name server which handles requests for that top level domain. For this URL `www.dnsexample.com` it would return the IP address for a name server handling `.com` requests

4. Next a query is made to the Top Level Domain name server returned from the earlier request. The TLD server returns the address of the name server handling the domain (`dnsexample.com`) requested for.

5. Next a request is made to the Domain level name server which looks up in its zone file and returns the IP address for the domain (`www.dnsexample.com`) requested

### Reference

[An Introduction to DNS Terminology, Components, and Concepts](https://www.digitalocean.com/community/tutorials/an-introduction-to-dns-terminology-components-and-concepts)