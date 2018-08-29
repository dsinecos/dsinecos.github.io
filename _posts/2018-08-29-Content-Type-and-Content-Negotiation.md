---
layout: post
title:  "Content negotiation during a HTTP Request-Response cycle"
categories: blog
---

When a resource is requested using HTTP, the client can specify its preference and compatibility for different representations of that resource. 

A representation can be understood as a format of data. For instance 'name = "John Doe"' can have both a JSON representation `{ name: "John Doe" }` or an XML representation `<name>John Doe</name>`

## Content Negotiation

During the HTTP Request-Response cycle, the client and server negotiate the resource and its representation based on available representations of resources on server side and compatibility to handle various forms of data on client side

### Client side Headers 
When making a HTTP request the client can specify what representations of a resource it can handle using the following headers 

1. `Accept` - Specifies the type of content that the client can accept. These are specified using MIME types which are a standard for defining the type of content being exchanged. MIME types are like file extensions which let the operating system know which application to use to open the file. MIME types provided in the `Accept` header indicate to the server, what types of content can the client (browser) handle in the response.

   `image/png` is a MIME type which indicates the content is a `png` image. 

   The MIME types can also be provided with a `q` or quality attribute to specify the preference order for certain types of content. For instance the header
   
   `Accept: image/png, image/jpeg;q=0.9, image/bpm;q=0.8` 
   
   indicates to the server that it prefers the 'png' format over the 'jpeg' format over the 'bmp' format. 
   
   When the quality attribute for a MIME type is not specified, it is assumed to be 1 (highest priority)

2. `Accept-Charset` - Used to specify the encoding that the client is compatible with such as 'UTF-8' (Refer [Charsets and Encoding](https://dsinecos.github.io/blog/Unicode-and-UTF-8))

3. `Accept-Encoding` - Used to specify the compression algorithm the client is compatible with, such as 'deflate', 'gzip'.

4. `Accept-Language` - Used to specify the preferred language the client would like the resource in. Eg. 'en-US'


### Server side Headers

When the server sends back the response, it attaches various headers which let the client know how to process the resource

1. `Content-Type` - header specifies the type of content using the MIME type. This is necessary for the browser to render the data correctly.

   A `Content-Type: text/html` lets the browser know it can render the HTML data. A `Content-Type: image/jpeg` specifies that the data represents a JPEG image.

   This header also specifies the encoding used using the charset attribute. Eg. `Content-Type: text/html; charset=utf-8`

2. `Content-Encoding` - Indicates the compression algorithm used in order of application. Eg. `Content-Encoding: gzip, deflate` 

3. `Content-Language` - Indicates for which language audience the content is intended. It does not necessarily imply that the content would be in that language however.