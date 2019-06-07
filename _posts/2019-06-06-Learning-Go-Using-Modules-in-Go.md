---
layout: post
title:  "Learning Go - Using Modules in Go"
categories: blog
---

I'm writing this post to summarize the salient points about using Go Modules. I covered package and dependency management in Go existing prior to modules in [Learning Go - Packages and Dependency Management](https://dsinecos.github.io/blog/Learning-Go-Packages-and-Dependency-Management)

## Contents
- [Go Modules](#go-modules)
    - [What is a Go Module?](#what-is-a-go-module)
    - [Go Modules and Go version compatibility](#go-modules-and-go-version-compatibility)
    - [Responsibility of files](#responsibility-of-files)
- [How to?](#how-to)
  - [Create a new module](#create-a-new-module)
  - [Dependency management](#dependency-management)
    - [Upgrading a dependency](#upgrading-a-dependency)
    - [Working with multiple major versions of a Dependency](#working-with-multiple-major-versions-of-a-dependency)
    - [Removing unused dependencies](#removing-unused-dependencies)
- [FAQ](#faq)
    - [Queries](#queries)
- [References](#references)

# Go Modules

### What is a Go Module?

> A module is a collection of Go packages stored in a file tree with a go.mod file at its root

### Go Modules and Go version compatibility

Go modules are enabled in Go version 1.11 and higher

For Go version 1.11 and 1.12 Go modules can be used 

> when the current directory or any parent directory has a go.mod, provided the directory is outside $GOPATH/src

The above behavior is set for Go versions 1.11 and 1.12 using a temporary environment variable, `GO111MODULE`. By default `GO111MODULE` is set to `auto` allowing Go to enable or disable module support based on the current directory

### Responsibility of files

Using Go modules relies on `go.mod` and `go.sum` with the following responsibilities

**go.mod**

`go.mod` allows to list and track dependencies (with versions) for a module

From Go Docs

> - Defines the module’s module path, which is also the import path used for the root directory

> - Defines a module's dependency requirements, which are the other modules needed for a successful build. Each dependency requirement is written as a module path and a specific semantic version

> - Only appears in the root of the module. Packages in subdirectories have import paths consisting of the module path plus the path to the subdirectory

**go.sum**

`go.sum` provides checks to authenticate the code being loaded

From Go Docs

> Lists the cryptographic hash of the expected file tree for each of the module’s dependencies. 

> Go command uses `go.sum` to verify that dependencies are bit-for-bit identical to the expected versions before using them in a build

> `go.sum` file only lists hashes for the specific dependencies used by that module. When adding a new dependency or updating dependencies with `go get -u`, there is no corresponding entry in `go.sum` and therefore no direct authentication of the downloaded bits

# How to?

## Create a new module

1. Create a project folder `myApp` - `mkdir myApp` 

   The project folder need not be inside the `$GOPATH/src` path

2. Move into the project folder - `cd myApp`

3. Setup a `go.mod` file - `go mod init <import-path>` Or `go mod init github.com/username/myApp`

4. Initialize a git repository and commit `go.mod` file to the repository (As you add dependencies `go.sum` will be created at the root which should also be committed to the repository)

## Dependency management

**Resolving a Go dependency from `import`**

![dependency-resolution-via-import](/assets/dependency-resolution-via-import.svg)

**List all dependencies**

`go list -m all` Lists the current module and all its dependencies (direct and indirect)

### Upgrading a dependency

1. List tagged versions of a module

   `go list -m -versions <package-path-name>`

2. Upgrade a dependency to its latest version (Latest minor version)

   `go get xyz` Or `go get rsc.io/sampler`

3. Upgrade a dependency to a specific version

   `go get xyz@version` Or `go get rsc.io/sampler@v1.3.1`

### Working with multiple major versions of a Dependency

Multiple major versions of a dependency can be used within a single Go module.This is possible as Go uses a different path to define each major version of a dependency eg. `rsc.io/quote` represents version 1.x.x while `rsc.io/quote/v3` represents version 3.x.x. 

Beginning from version 2, the path for a dependency must in the major version.

Go allows a build to include at most one version of any particular module path therefore it is impossible for a program to build with both `rsc.io/quote v1.5.2` and `rsc.io/quote v1.6.0` or two different minor or patch versions of the same major version of a dependency

From Go Docs

> Allowing different major versions of a module (because they have different paths) gives module consumers the ability to upgrade to a new major version incrementally. In this example, we wanted to use quote.Concurrency from rsc/quote/v3 v3.1.0 but are not yet ready to migrate our uses of rsc.io/quote v1.5.2

### Removing unused dependencies

`go mod tidy` Cleans up unused dependencies

# FAQ

1. How to upgrade Golang version?/ How to run multiple Golang versions?

   Refer [How to update the Go version](https://gist.github.com/nikhita/432436d570b89cab172dcf2894465753)

### Queries 

1. When does `go.mod` file list indirect dependencies and when does it not?

2. Does Go allow multiple versions (minor and patch) for indirect dependencies? Or What happens if two direct dependencies have incompatible versions of indirect dependencies (and if the minor versions are not backward compatible)?

# References

1. [Blog Post - Anatomy of Modules in Go](https://medium.com/rungo/anatomy-of-modules-in-go-c8274d215c16)
2. [Go Docs - Using Go Modules](https://blog.golang.org/using-go-modules)
3. [Go Docs - Go Modules in 2019](https://blog.golang.org/modules2019)
