---
layout: post
title:  "Golang: Dev environment setup in Ubuntu 16.04"
categories: howto
---

## Contents
1. Setup Go runtime in Ubuntu 16.04
2. Configure VS Code for Golang

### Setup Go runtime in Ubuntu 16.04

1. [Download Go for Linux](https://golang.org/dl/)
2. Open Terminal
   - Go to 'Downloads' folder
   - `cd Downloads`
3. Extract the downloaded Go archive in `/usr/local`
   - `tar -C /usr/local -xzf go1.10.3.linux-amd64.tar.gz`
4. Update `PATH` environment variable
   - `nano $HOME/.profile`
   - Append `export PATH=$PATH:/usr/local/go/bin` to this file
5. Restart computer
6. Type `go` in terminal to check if the installation was successful
   - Expected output 
     `Go is a tool for managing Go source code`

### Configure VS Code for Golang

1. Open VS Code
2. Go to View -> Extensions
3. Type `go` in the search bar
4. Install the extension provided by Microsoft with over 4Mn downloads
5. Restart VS Code
6. Open a new file
7. Select the `Plain Text` option at the bottom right corner of the screen
8. Modify it to `Go` language
9. Select the `Analysis Tools Missing` option at the bottom right corner of the screen
10. Select Install


