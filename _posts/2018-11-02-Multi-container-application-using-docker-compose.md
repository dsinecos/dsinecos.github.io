---
layout: post
title:  "Setting up a multi-container application using Docker-compose"
categories: blog
---

I'm writing this post as a guide to setup a multi-container application using Docker-compose. The application will be running two services, a Node application and a RabbitMQ server.

The github repo for this blog is hosted [here](https://github.com/dsinecos/learn-docker-compose)

- [Initial Setup](#initial-setup)
    - [Setup `docker-compose.dev.yml`](#setup-docker-composedevyml)
        - [Configuration to setup RabbitMQ](#configuration-to-setup-rabbitmq)
        - [Configuration to setup Node application](#configuration-to-setup-node-application)
        - [Configuration to setup Tests](#configuration-to-setup-tests)
    - [Setup Dockerfile.dev](#setup-dockerfiledev)
    - [Setup `index.js` to receive messages from RabbitMQ](#setup-indexjs-to-receive-messages-from-rabbitmq)
    - [Setup `sendMessage.js` to send messages to RabbitMQ](#setup-sendmessagejs-to-send-messages-to-rabbitmq)
- [Running multiple containers using `docker-compose`](#running-multiple-containers-using-docker-compose)
    - [Setup bash script](#setup-bash-script)
        - [Changes to `Dockerfile.dev`](#changes-to-dockerfiledev)
    - [Run the container setup again using `docker-compose`](#run-the-container-setup-again-using-docker-compose)
    - [Run `sendMessage.js` inside the `node-application` container](#run-sendmessagejs-inside-the-node-application-container)
- [References](#references)


# Initial Setup

I'll be using [node-project-boilerplate](https://github.com/dsinecos/node-project-boilerplate) for the initial setup.

Clone `node-project-boilerplate` into a folder 'learn-docker-compose'

## Setup `docker-compose.dev.yml`

```yml
version: '3'
services:
```

<br>

### Configuration to setup RabbitMQ

```yml
  rabbitmq:
    image: 'rabbitmq:3.6.6-management'
    ports:
      - "4369:4369"
      - "5672:5672"
      - "15672:15672"
      - "25672:25672"
      - "35197:35197"
    volumes:
      - ./data:/var/lib/rabbitmq
      - ./data/logs:/var/log/rabbitmq
    hostname: rabbit
```

- `image: 'rabbitmq:3.6.6-management'` Pulls the relevant image to build the RabbitMQ container

- `ports` Exposes the ports for connecting to the RabbitMQ server and to connect to RabbitMQ's management plugin

- `volumes` Are defined to persist RabbitMQ logs and data between container restarts
    - `./data:/var/lib/rabbitmq` - Maps the folder to store RabbitMQ data
    - `./data/logs:/var/log/rabbitmq` - Maps the folder to store RabbitMQ logs

- `hostname: rabbit` RabbitMQ stores data based on what it calls the "Node Name", which defaults to the hostname. For usage in Docker we should specify hostname explicitly so that we don't get a random hostname and can keep track of our data [1]

**Additional configuration for RabbitMQ**

- To modify default username and password, add the following to `docker-compose.dev.yml` against `rabbitmq` service
    - `environment:`
        - `RABBITMQ_DEFAULT_USER=user`
        - `RABBITMQ_DEFAULT_PASS=pass`
        - `RABBITMQ_DEFAULT_VHOST=vhost`


<br>

### Configuration to setup Node application

```yml
  node-application:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "9229:9229"
    volumes:
      - /usr/app/node_modules
      - .:/usr/app
```

- `ports`
    - `"9229:9229"` Port has been exposed to allow debugging of the node application. Other ports can be exposed as required

- `volumes`
    - `/usr/app/node_modules` The `node_modules` folder is not mapped to any directory on the local machine and is used as is
    - `.:/usr/app` The remaining folders are referenced on the local machine to allow for restarting the node application when changes are made to the code

<br>

### Configuration to setup Tests

```yml
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /usr/app/node_modules
      - .:/usr/app
    command: ["yarn", "run", "tests"]
```

- `command: ["yarn", "run", "tests"]` The default startup command specified inside Dockerfile.dev is overriden to run tests instead using a yarn script

<br>

## Setup Dockerfile.dev

```dockerfile
FROM node:8-alpine

WORKDIR /usr/app/

COPY package*.json ./
RUN yarn install

CMD ["./node_modules/nodemon/bin/nodemon.js", "--inspect=0.0.0.0:9229", "index.js"]
```

- `FROM node:8-alpine` Pull the base image for the container

- `WORKDIR /usr/app/` Specify the working directory inside the container

- `COPY package*.json ./` Copies `package.json` from local machine to inside the container.

- `RUN yarn install` Setup dependencies using yarn

- `CMD ["./node_modules/nodemon/bin/nodemon.js", "--inspect=0.0.0.0:9229", "index.js"]` - Run node application in debug mode, exposing the debugger on port 9229. Nodemon is used to allow restarting the application when changes to code are made

<br>

## Setup `index.js` to receive messages from RabbitMQ

Install `amqplib` as a dependency using `yarn add amqplib`

I'm using the code from RabbitMQ tutorial [2] to setup `index.js` which will receive messages from RabbitMQ

```javascript
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@rabbitmq:5672', (err, conn) => {
    if (err) {
        console.log(`Error ${err}`);
    }
    conn.createChannel((error, ch) => {
        if (error) {
            console.log(`Error ${err}`);
        }
        const q = 'hello';

        ch.assertQueue(q, { durable: true });
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q);
        ch.consume(q, (msg) => {
            console.log(" [x] Received %s", msg.content.toString());
        }, { noAck: true });
    });
});
```

The connection URL uses the default username and password to connect `amqp://guest:guest@rabbitmq:5672`. `@rabbitmq` is taken from the service name used in `docker-compose.dev.yml`

<br>

## Setup `sendMessage.js` to send messages to RabbitMQ

```javascript
const amqp = require('amqplib/callback_api');

amqp.connect('amqp://guest:guest@rabbitmq:5672', (err, conn) => {

    if (err) {
        console.log(`Error ${err}`);
    }
    conn.createChannel((error, ch) => {
        if (error) {
            console.log(`Error ${err}`);
        }

        const q = 'hello';
        const msg = 'Hello World!';

        ch.assertQueue(q, { durable: true });
        ch.sendToQueue(q, Buffer.from(msg), { persistent: true });
        console.log(`Sent ${msg}`);
    });
    setTimeout(() => { conn.close(); process.exit(0); }, 500);
});
```

<br>

# Running multiple containers using `docker-compose`

`docker-compose -f docker-compose.dev.yml up --build`

When running the setup using the above command, I ran into the situation where the Node application to receive messages was started before the RabbitMQ server was accepting connections on port `5672`. 

In order to resolve the order of execution, I used a bash script `wait-for-it.sh` [3] which ensures that the startup command for the Node application is run only after RabbitMQ server starts listening for connections on port `5672`

<br>

## Setup bash script

Add `wait-for-it.sh` to scripts folder

Run `chmod 755 ./scripts/wait-for-it.sh` to make the bash file an executable

### Changes to `Dockerfile.dev`

Setup bash on the alpine image (it isn't available by default). Add the following command after pulling the base image

`RUN apk add --no-cache bash`

Modify startup command to the following to invoke the node application only after RabbitMQ starts listening for connections on port `5672`

`CMD ["./scripts/wait-for-it.sh", "rabbitmq:5672", "--", "./node_modules/nodemon/bin/nodemon.js", "--inspect=0.0.0.0:9229", "index.js"]`

<br>

## Run the container setup again using `docker-compose`

- Remove the earlier created data folder using `rm -rf ./data`

- `docker-compose -f docker-compose.dev.yml up --build`

<br>

## Run `sendMessage.js` inside the `node-application` container

- `docker exec -it <container-id-for-node-application> sh`

- `node sendMessage.js`


<br>

# References

[1] [RabbitMQ Docker Image](https://hub.docker.com/r/library/rabbitmq/)

[2] [RabbitMQ Tutorial](https://www.rabbitmq.com/tutorials/tutorial-one-javascript.html)

[3] [wait-for-it.sh](https://github.com/vishnubob/wait-for-it)

[Setting up a RabbitMQ Cluster on Docker](http://josuelima.github.io/docker/rabbitmq/cluster/2017/04/19/setting-up-a-rabbitmq-cluster-on-docker.html)

[Modifying default username and password on RabbitMQ](https://github.com/docker-library/rabbitmq/issues/99#issuecomment-239098867)

