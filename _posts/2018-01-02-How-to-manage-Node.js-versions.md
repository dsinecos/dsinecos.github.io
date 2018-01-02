---
layout: post
title:  "How to manage Node.js versions on Ubuntu 16.04"
categories: howto
---

`n` Node version manager - [Reference](https://github.com/tj/n)

#### How to handle `Error: Module version mismatch. Expected 11, got 1.`

`rm -rf node_modules`

`sudo npm install`

#### How to list the versions of node installed?

Type in terminal

`n`

#### How to update node to the latest stable version?

`sudo npm cache clean -f	`

`sudo npm install -g n`

`sudo n stable`

#### How to install a specific node verison?

`n <version>`

`n 6.10.1`

[Refer](https://stackoverflow.com/a/23569481/7640300)

#### How to use a particular version of node?

`sudo n <version>`

`sudo n 6.10.1>`

