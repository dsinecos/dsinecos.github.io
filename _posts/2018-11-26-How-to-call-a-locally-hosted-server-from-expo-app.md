---
layout: post
title:  "How to call a locally hosted server from Expo?"
categories: blog
---

While developing a React Native application I needed my application running inside Expo on my mobile to access a mock server running on my laptop (development machine)

I'm writing this post to list out the two ways to achieve this and what I learnt about Expo's behavior under the hood.

### Index
- [Problem](#problem)
- [How Expo works?](#how-expo-works)
- [Solution](#solution)
    - [By using `ngrok` or `localtunnel`](#by-using-ngrok-or-localtunnel)
    - [By running the mock-server on `0.0.0.0`](#by-running-the-mock-server-on-0000)

## Problem

When my application running inside the Expo app on my mobile tried to access a mock server running on `localhost` on my laptop I got back a `Network Error`. 

To get the setup working there I figured two approaches

## How Expo works?

![how-expo-works](/assets/how-expo-works.svg)

To figure out a solution I tried to understand how Expo runs the React Native code base inside the Expo Application on our mobile. I went through Expo's documentation [How Expo works?](https://docs.expo.io/versions/latest/workflow/how-expo-works) and mapped it to the output I got for my own application

1. After executing `yarn start` I get a QR code to scan followed by
   
   'Your app is now running at URL: exp://10.1.0.146:19000' 

2. On scanning the QR code the Expo app on my mobile makes a request to `10.1.0.146:19000`. This returns a JSON which includes metadata about our application and the URL where React Native Packager Server is running. This is provided against the key `bundleUrl`

3. By default React Native packager runs a server on `localhost:8001`

   Based on the value of `bundleUrl` Expo had launched the React Native packager server on `10.1.0.146:19001`

4. Next the Expo app on mobile fetches the app's Javascript from `bundleUrl` served on `10.1.0.146:19001`

I get a `Network error` because while my application is running on my mobile it makes a request to `127.0.0.1:8000`. Presumably it either refers to the loopback address on Android where there isn't any server running on port 8000 or the address is unidentified and hence a `Network error`

In order to access the mock server it has to be available either on my development machine's IP address (where it will be accessible because my mobile and laptop are on the same network as required by Expo) or on a universally accessible URL over the internet

## Solution

### By using `ngrok` or `localtunnel`

By using either of these modules we can expose a server running on localhost on the web. 

Next we can use the corresponding URL to access the mock-server from our application running inside Expo

I went ahead with `localtunnel`

1. Installing `localtunnel` globally on my dev machine

   `yarn global add localtunnel`

2. I used `json-server` to setup and run a mock server. The following command sets up the mock server on localhost and port 8000

   `json-server --port 8000 ./db.json --watch`

3. Next to expose the mock server to the web use `localtunnel`

   `lt --port 8000 --subdomain application-mock-server`

   The above command will return a URL accessible across Internet of the form `https://application-mock-server.localtunnel.me`. This URL can be plugged inside the React Native code base and will be accessible from the application running inside Expo on the mobile.

### By running the mock-server on `0.0.0.0`

Another approach is to run the mock server on `0.0.0.0` instead of `localhost` or `127.0.0.1`. 

This makes the mock server accessible on the LAN and because Expo requires the development machine and the mobile running the Expo app to be on the same network the mock server becomes accessible too. 

This can be achieved with the following command when using `json-server`

`json-server --host 0.0.0.0 --port 8000 ./db.json --watch`

