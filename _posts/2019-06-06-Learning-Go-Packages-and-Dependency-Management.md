---
layout: post
title:  "Learning Go - Packages and Dependency Management"
categories: blog
---

I'm writing this post to summarize my understanding of Package and Dependency management in Go.

_As of writing this post Go modules have been introduced. This post however covers package and dependency management in Go that existed prior to modules_

## Contents
- [Go Workspace](#go-workspace)
  - [Starting a project in Go](#starting-a-project-in-go)
    - [Creating a project in Go](#creating-a-project-in-go)
    - [Compiling a project in Go](#compiling-a-project-in-go)
    - [Executing a project in Go](#executing-a-project-in-go)
  - [Go workspace - Folder structure and responsibilities](#go-workspace---folder-structure-and-responsibilities)
- [Importing external packages & commands](#importing-external-packages--commands)
  - [Fetching an external package](#fetching-an-external-package)
  - [Importing an external package in a Go project](#importing-an-external-package-in-a-go-project)
  - [Compiling external packages](#compiling-external-packages)
- [File and Folder structure for a project in Go](#file-and-folder-structure-for-a-project-in-go)
    - [One executable package](#one-executable-package)
    - [One non-executable package](#one-non-executable-package)
    - [n Executable packages](#n-executable-packages)
    - [n Non-executable pacakges](#n-non-executable-pacakges)
- [FAQ](#faq)
    - [What is the difference between `go build` and `go install`?](#what-is-the-difference-between-go-build-and-go-install)
- [References](#references)

# Go Workspace



As a Node.js developer moving to Go, I was looking for the equivalents of `npm` and `package.json` and `npm init` to initialize a project. It took me a while to get a hang of the notion of workspace in Go and the resulting differences in initializing a project in Go compared to Node.js.

## Starting a project in Go

The greatest shift for me as a developer coming from Node.js was the following statement from Go Docs

> Go programmers typically keep all their Go code in a single workspace

**Creating a project in Node.js** 

1. Create a new folder - `mkdir myApp`

2. Initialize `package.json` to track dependencies - `npm init -y`

3. Initialize Git repository `cd myApp; git init`

### Creating a project in Go

1. Identify the Go workspace from `GOPATH` environment variable `go env GOPATH` (The default value of GOPATH is `$HOME/go`. Suppose for a username `demo` this is `/home/demo/go`)

2. Move to $GOPATH - `cd /home/demo/go`

3. Move to `src` folder - `cd src`

4. Inside `src` folder there are multiple folders each corresponding to domains hosting Go code (eg. `github.com`, `golang.org`). Suppose the new project we create is going to be hosted on `github.com` under account `demouser`. Move to the folder `github.com/demouser` - cd `github.com/demouser`

5. The earlier step where we create a namespace using `github.com/<username>` can be skipped and the project folder can be directly created inside `$GOPATH/src/`. Creating the unique namespace would help to share the package in the future

6. Create a folder for the project `myApp` - `mkdir myApp`

7. Initialize Git repository for the project - `cd myApp; git init` 

### Compiling a project in Go

1. Move to the project's folder `cd $GOPATH/github.com/demouser/myApp`

2. `go install`

The above command will 

1. Create package archives for non-executable packages in `myApp` and store them in `$GOPATH/pkg`

2. Create binary for executable packages (`package main`) in `myApp` and store them in `$GOPATH/bin`

### Executing a project in Go

Assuming that `$GOPATH/bin` is added to $PATH (for Unix systems) the project can be executed from anywhere on the system with the following command `myApp` (This also assumes that myApp has a single executable `package main` and not multiple commands)

## Go workspace - Folder structure and responsibilities

The long winded path to creating a project folder in Go has its reasons and becomes palatable after understanding the folder structure at `$GOPATH` and the responsibilities of each of the folders

    bin/
    pkg/
     |--github.com
        |--username1
    src/
     |--github.com
        |--username1
           |--project11
           |--project11
        |--username2
           |--project21
        |--username3
           |--project31
     |--golang.org
     |--gopkg.in


1. `src` - This folder houses the code for all your projects and external dependencies that you load from remote repositories (using `go get`)

2. `pkg` - This folder stores package archives after compiling (using `go install` for non-executable packages). This is to avoid re-compilation of packages each time a program using these packages is compiled

3. `bin` - This folder stores the binary for executable packages (using `go install` for executable packages)

Both `src` and `pkg` folders use the unique namespace `<remote-URL>/folder-name/` (eg. `github.com/username`) to store code and archive files

<br>

# Importing external packages & commands

## Fetching an external package

An external package can be installed using the `go get` command

On running `go get gopkg.in/yaml.v2` the source code for the package will be downloaded at `$GOPATH/src/gopkg.in/yaml.v2`

## Importing an external package in a Go project

To import the above package in a Go file `import gopkg.in/yaml.v2`. 

When importing a package Go first looks for the package at `$GOROOT/src` followed by `$GOPATH/src`. Since `yaml.v2` is an external package Go finds it at `$GOPATH/src`

**Importing a nested package**

A nested package can be imported by providing its relative path eg `import github.com/demouser/pkg/nestedpkg` after it has been `go get` from the remote repository `go get github.com/demouser/pkg`

## Compiling external packages

When `go install` is run, the external package is compiled and stored as an archive in `$GOPATH/pkg` with the appropriate namespace (`gopkg.in/`)

<br>

# File and Folder structure for a project in Go

The file and folder structure for a project in Go depends upon the number of executable and non-executable packages

### One executable package

The project can have multiple Go files with `package main`

### One non-executable package

The project can have multiple Go files with `package <package-name>`

### n Executable packages

1. Create a `cmd` folder inside the project folder

2. Create a separate folder for each executable package inside `cmd` folder

When `go install` is run on this project the binary for the executable packages will take the name of the last enclosing folder and not the filename housing the `main()` function. Eg. `$GOPATH/src/github.com/demouser/myApp/cmd/test` would be compiled to `test`

### n Non-executable pacakges

Each non-executable package should be declared in its own folder (else it returns a `package can't be loaded error` on `go install`)

When `go install` is run, each of the packages are compiled and stored as archive files at `$GOPATH/pkg/` 

<br>

# FAQ

### What is the difference between `go build` and `go install`?

For non-executable packages
1. `go build` compiles the package and discards the result
2. `go install` compiles the package and places the archive at `$GOPATH/pkg`

For executable packages
1. `go build` compiles the package and places the resulting binary in the current directory
2. `go install` compiles the package and places the binary at `$GOPATH/bin`

<br>

# References

1. [Github Repo - Standard Go Project Layout](https://github.com/golang-standards/project-layout)
2. [Blog Post - Filesystem Structure of a Go project](https://flaviocopes.com/go-filesystem-structure/)
3. [Official Go Docs - How to Write Go Code](https://golang.org/doc/code.html#Organization)
4. [Blog Post - Everything you need to know about Packages in Go](https://medium.com/rungo/everything-you-need-to-know-about-packages-in-go-b8bac62b74cc)
5. [Blog Post - Anatomy of Modules in Go](https://medium.com/rungo/anatomy-of-modules-in-go-c8274d215c16)
6. [Blog Post - `go install` vs `go build`](https://pocketgophers.com/go-install-vs-go-build/)
