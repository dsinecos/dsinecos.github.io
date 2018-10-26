---
layout: post
title:  "Docker Images - Building and Caching"
categories: blog
---

I'm writing this post to put down my mental model of the Image building process using Docker

<br>

## Structure of a Dockerfile

The Dockerfile can broadly be divided into three parts

1. Load a Parent image (or Base image) using the `FROM` command

2. Run various commands to setup additional programs and dependencies

3. Specify the startup command for the Image

<br>

## Build process to create an Image

Consider the following Dockerfile

```
FROM alpine

RUN apk add --update redis

CMD ["redis-server"]
```

When building an image there are multiple intermediate images created. 

After the execution of each command inside Dockerfile, a filesystem snapshot is taken and an intermediate image is created. This image is run as a container where the next command in the Dockerfile is executed

![image-building-process](/assets/image-building-process.svg)

The process repeats until the `CMD` command. At this point a filesystem snapshot is taken to create an image and the startup command for that image is assigned accordingly. Finally docker returns the image-id as `Successfully built <image-id>`

<br>

## Image Caching, its impact on performance and caveats

To improve performance Docker caches the images it fetches from DockerHub and also the intermediate images during the build process. 

When rebuilding the image, Docker checks it cache to see if it has already downloaded a Parent image. It also checks the cache for intermediate images and uses them instead of rebuilding. 

If the order of operations is changed in the Dockerfile the cached image can no longer be used and the intermediate images will be rebuilt. 

Likewise because of changes to files and folders if a command results in a changed filesystem snapshot (eg. `COPY ./ ./` in the case that any of the files have been modified), the corresponding intermediate image would be rebuilt and all of the following images as well.

Consider the Dockerfile

```
FROM node:alpine

WORKDIR /usr/app

COPY ./ ./
RUN npm install

CMD ["npm", "start"]
```

During development, every time a source file is changed, this will lead to reinstalling the npm dependencies. This is because the intermediate image resulting from the command `COPY ./ ./` would have changed if any files have been modified. Since the command to install dependencies lies after, the subsequent images will also be rebuilt. To avoid this the Dockerfile can be modified as follows

```
FROM node:alpine

WORKDIR /usr/app

COPY ./package.json ./
RUN npm install
COPY ./ ./

CMD ["npm", "start"]
```

With the above change cached intermediate images can be used until the command `COPY ./ ./` (provided no additional dependencies have been added as that would modify `package.json`). Npm modules would not have to be reinstalled each time and result in faster image rebuilds 