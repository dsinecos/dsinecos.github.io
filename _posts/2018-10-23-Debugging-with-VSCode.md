---
layout: post
title:  "Debugging with VSCode"
categories: blog
---

As I'm working my way from `console.log` statements to appropriate debugging tools I'm writing this post on setting up multi-targeted debugging using VSCode for a Node application running inside a Docker container.

This post covers setting up VSCode for debugging a NodeJS application. I'll be writing another post covering steps and configuration details to debug JavaScript code running inside Chrome using VSCode.

## Index
- [Requirements](#requirements)
- [What happens when a Node process is run in the debug mode?](#what-happens-when-a-node-process-is-run-in-the-debug-mode)
- [Setup Overview](#setup-overview)
- [How to?](#how-to)
    - [Debug a Node process running inside a Docker container?](#debug-a-node-process-running-inside-a-docker-container)
    - [Connect the debugging client (VSCode) to the Node process' debug socket?](#connect-the-debugging-client-vscode-to-the-node-process-debug-socket)
    - [Get VSCode to reattach the debugger automatically when Nodemon restarts the application inside the container?](#get-vscode-to-reattach-the-debugger-automatically-when-nodemon-restarts-the-application-inside-the-container)
    - [Setup a multi-targeted debugging allowing to debug both the server side and the client side from VSCode?](#setup-a-multi-targeted-debugging-allowing-to-debug-both-the-server-side-and-the-client-side-from-vscode)
        - [Setup configuration for debugging JavaScript running inside Chrome](#setup-configuration-for-debugging-javascript-running-inside-chrome)
        - [Setup multi-targeted debugging](#setup-multi-targeted-debugging)
- [References](#references)

<br>

# Requirements

1. Debug client side and server side code (multi-targeted debugging) with the same Debugging Client (VSCode)

2. Debug an application running inside a Docker container

3. Debugging client (VSCode) should re-attach to the process as Nodemon restarts the application on code changes

<br>

# What happens when a Node process is run in the debug mode?

To debug a Node application it is started with the `--inspect` flag. 

`node --inspect index.js`

The `--inspect` flag causes the Node application process to listen for debug commands via WebSockets on a default host and port - `127.0.0.1:9229`. A debugging client such as Chrome DevTools or VSCode's debugger can send the debug commands (set breakpoints, pause, continue, stop) on this socket and also listen for responses.

To debug a node application it is thus required to run it with the `--inspect` flag.

<br>

# Setup Overview

![vscode-debugger-setup](/assets/vscode-debugger-setup.svg)

<br>

# How to?

## Debug a Node process running inside a Docker container?

To debug a Node application running inside a Docker container, the socket (host:port) on which the debugger listens for commands has to be exposed outside the container. To modify the default socket the following command can be used

`node --inspect=0.0.0.0:9229 index.js`

The debugger has been started on the host `0.0.0.0` and not `127.0.0.1` to make it accessible from outside the container. After executing the above command the debugger is listening on `0.0.0.0:9229` inside the container.

Next, we can map this to the port `9229` on the local machine using the `-p` flag in `docker run` command

`docker run -p 9229:9229 <image-id>`

With the above mapping set, the debugger can be accessed on the local machine on `127.0.0.1:9229`. To check if it works go to the following URL in the browser

`http://localhost:9229/json/list`

<br>

## Connect the debugging client (VSCode) to the Node process' debug socket?

1. Go to the root of the project directory.

2. Open `.vscode/launch.json`

3. Select the option to 'Add Configuration' at the bottom right of the screen

4. Select the configuration for 'Docker: Attach to Node'. The following default configuration will be added to `launch.json`

```json
{
    "type": "node",
    "request": "attach",
    "name": "Docker: Attach to Node",
    "port": 9229,
    "address": "localhost",
    "localRoot": "${workspaceFolder}",
    "remoteRoot": "/usr/src/app",
    "protocol": "inspector"
},
```
   Modify `remoteRoot` to point at the project directory inside the container.

5. Run the Node application inside the container using `docker run` command

6. Run the VSCode debugger with the `Docker: Attach to Node` configuration. This should attach the VSCode debugger to the running Node application inside the container.

<br>

## Get VSCode to reattach the debugger automatically when Nodemon restarts the application inside the container?

Modify the `Docker: Attach to Node` configuration in `launch.json` and add the following field

```json
{
    "restart": true
}
```

<br>

## Setup a multi-targeted debugging allowing to debug both the server side and the client side from VSCode?

### Setup configuration for debugging JavaScript running inside Chrome

1. Install extension - 'Debugger for Chrome' by Microsoft

2. Open 'launch.json'

3. Select the option to 'Add Configuration' at the bottom right of the screen

4. Select the configuration for 'Chrome: Launch'. The following default configuration will be added to `launch.json`

```json
{
    "type": "chrome",
    "request": "launch",
    "name": "Launch Chrome",
    "url": "http://localhost:8080",
    "webRoot": "${workspaceFolder}",
}
```
   Modify the `url` to point to the port where the application is being served. Also modify the `webRoot` to point to the `public` folder used to host static files. 

```json
{
    "url": "http://localhost:3000",
    "webRoot": "${workspaceFolder}/public",
}
```

In my setup I was unable to set breakpoints on JavaScript code inside `index.html` wrapped within `<script>` tags. I was able to debug `.js` files that were loaded into `index.html`.

### Setup multi-targeted debugging 

Setup a compound debug configuration by adding the following to 'launch.json'

```json
{
    "configurations": [
    ],
    "compounds": [
        {
            "name": "Server/Client",
            "configurations": ["Launch Chrome", "Docker: Attach to Node"]
        }
    ]
}
```
   When the debugging session is started in VSCode both the configurations will be launched allowing to debug both the server and the client from VSCode

# References

1. [What happens when a Node application is run in debug mode?](https://nodejs.org/en/docs/guides/debugging-getting-started/#command-line-options)
2. [Debugging Node Code in VS Code](https://scotch.io/tutorials/debugging-node-code-in-vs-code)
3. [How to Debug a Node.js app in a Docker Container](https://blog.risingstack.com/how-to-debug-a-node-js-app-in-a-docker-container/)
4. [Live Debugging with Docker](https://blog.docker.com/2016/07/live-debugging-docker/)
5. [Restarting debug sessions automatically when source is edited](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_restarting-debug-sessions-automatically-when-source-is-edited)
6. [Multi-target debugging in VSCode](https://code.visualstudio.com/docs/editor/debugging#_multitarget-debugging)