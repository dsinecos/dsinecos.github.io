---
layout: post
title:  "Git - Mental models"
categories: blog
---

I'm collating here the basic mental models that help me reason about Git's behavior. I plan to add more diagrams covering how various commands affect the object store as well as the working, staging and repo area both on the local and the remote repository.

- [Stages of a file](#stages-of-a-file)
- [Local and remote repositories](#local-and-remote-repositories)
- [`git-reset`](#git-reset)
    - [Difference between `git reset` and `git checkout`](#difference-between-git-reset-and-git-checkout)
- [References](#references)


## Stages of a file

Post `git init` a file in the directory can be in one of many stages. This is useful to understand how commands such as `git reset`, `git rebase` work. 

Nuanced understanding of how a command affects the stage of a file(s) helps avoid situations where one might lose data by using one of these commands.

![file-stages](/assets/file-stages.svg)

## Local and remote repositories

Git is a distributed version control system. Each local repository also contains a copy of all the remote repositories it is linked to. This comes in handy to understand the difference between `git fetch` and `git pull`

![git-repositories](/assets/git-repositories.svg)

## `git-reset`

![git-reset](/assets/git-reset.svg)

### Difference between `git reset` and `git checkout`

![difference-between-git-reset-and-git-checkout](/assets/difference-between-git-reset-and-git-checkout.svg)

## References

- [Atlassian Git Tutorials](https://www.atlassian.com/git/tutorials)
- [Getting started with Git](https://app.pluralsight.com/library/courses/git-getting-started)