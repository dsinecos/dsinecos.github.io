---
layout: post
title:  "Offline first app using redux-offline"
categories: blog
---

I have been working on a mobile application where I need to provide offline support. 

I'm writing this post to share my understanding of how `redux-offline` synchronizes data across the local storage on the mobile and the database on the server.

![redux-offline](/assets/redux-offline.svg)

As per the above diagram any changes made to the application data first reflects on redux-store. 

## App state - Online
![state-online](/assets/state-online.svg)

If the application is online, HTTP requests (GET, POST, PUT etc) are sent to the server updating the `redux-store` and the server accordingly. 

Also, each time a change to data happens on `redux-store` it is asynchronously updated on the Local storage (AsyncStorage in case of React Native)  

## App state - Offline
![state-offline](/assets/state-offline.svg)

If the application is offline, changes made to the application data first reflect on `redux-store` followed by an asynchronous update of the Local storage. The corresponding HTTP requests for those changes are stored in a queue. 

## When app state transitions from Offline to Online

When the app comes online, HTTP requests stored inside the queue are fired to update the `redux-store` and server. This brings the Local storage, `redux-store` and server in a consistent state.
