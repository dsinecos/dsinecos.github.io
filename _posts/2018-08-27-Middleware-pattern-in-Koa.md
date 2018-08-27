---
layout: post
title:  "Using the middleware pattern in blue-rabbit"
categories: blog
---

I'm writing a lightweight Nodejs-RabbitMQ microservice framework called [blue-rabbit](https://github.com/dsinecos/blue-rabbit/tree/application). It's design is inspired from the middleware pattern as used in Koa. 

I'm writing this post to better understand the implementation of the middleware pattern. I'll use code from `blue-rabbit` as the pivot to explain the implementation.

![Middleware Stack](/assets/middleware-pattern-in-koa.svg)

The middleware stack can be understood as a series of functions which every HTTP request passes through. In Koa, a HTTP request first flows down the stack and is processed by each middleware function. Once the request reaches the last function in the middleware stack, it then flows up the stack before the final response is sent.

The implementation of the middleware pattern in `blue-rabbit` uses two classes.

1. The `Application` class is responsible for setting up the
   - Connection to the RabbitMQ broker
   - Exchange and 
   - Queues to receive messages from

2. The `Context` class is a wrapper around each message received from the queue which provides various methods for manipulating individual messages

There are three key functions used to build the middleware pattern

## `use`

This method is defined in the `Application` class and is used to add functions to the middleware stack. It takes a function as an argument and appends it to the `middleware` property of the `Application` instance.

```javascript
    /**
         * Add a function to the middleware stack
         * @param {function} middlewareFunction 
         * @access public
         */
    use(middlewareFunction) {
        this.middleware.push(middlewareFunction);
    }
```

Each function defined as a middleware has the following signature

```javascript
    function middlewareFunc(context, next) {
        // Process context

        next();
    }
```

The call to `next()` is made to invoke the next function in the middleware stack.

## `onMessage`

This method is invoked each time a message is received from the queue.

```javascript
/**
     * Execute the middleware stack on the message received from the queue
     * @param {object} message 
     * @access private
     */
async onMessage(message) {
    const context = new Context(message, this);

    const middlewareStack = compose(this.middleware);
    try {
        await middlewareStack(context);
    } catch (err) {
        debug('Error caught in middleware stack');
        context.onerror(err);
    }
}
```

First it creates a `Context` instance which wraps the incoming message and provides methods for working with the message.

It creates a middleware stack using `compose`. The middleware stack is invoked with the message received as `context`.

The middleware stack can also be invoked as `middlewareStack(context, fn)` where `fn` is function which will be invoked when the message reaches the end of the middlewareStack

## `compose`

This is the key ingredient of the middleware pattern. It takes as input an array of functions and returns a function which invokes each function in the array in sequence 

The following code is from `koa-compose` library

```javascript
function compose (middleware) {
  if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
  for (const fn of middleware) {
    if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1
    return dispatch(0)
    
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      
      index = i
      
      let fn = middleware[i]
      
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()

      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }

    }
  }
}
```
I'm using subsets of code to focus on one functionality at a time for easier understanding. 

#### Validating arguments

The following lines are checks to ensure that `compose` receives an array as an argument and each of the elements inside the array is a function

```javascript
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
        for (const fn of middleware) {
            if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
        }
```

#### Invoke each function in the middleware stack in order

Next, it returns a function which when invoked, invokes each of the functions in the `middleware` array.

```javascript
return function (context, next) {
    
    return dispatch(0)

    function dispatch(i) {

        let fn = middleware[i]

        try {
            return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
            return Promise.reject(err)
        }

    }
}
```

`dispatch(0)` invokes the first function in the middleware array from the line `let fn = middleware[i]`.

Next, `fn(context, dispatch.bind(null, i + 1))`, invokes the next function in the middleware array. 

Each function defined as a middleware has the following signature

```javascript
    function middlewareFunc(context, next) {
        // Process context

        next();
    }
```

The call to `next()` is made to invoke the next function in the middleware stack. When we invoke `fn(context, dispatch.bind(null, i + 1))` we provide `dispatch.bind(null, i+1)` as the argument for next parameter. This is thus invoked using `next()` inside the middleware function.

The other instructions in the `dispatch` function are used to handle various edge cases.

#### Define behavior when processing reaches the end of the middleware stack

```javascript
return function (context, next) {

    return dispatch(0)

    function dispatch(i) {

        let fn = middleware[i]

        if (i === middleware.length) fn = next
        if (!fn) return Promise.resolve()

        try {
            return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
            return Promise.reject(err)
        }

    }
}
```

The following lines

```javascript
if (i === middleware.length) fn = next
if (!fn) return Promise.resolve()
```

are used to define behavior when we reach the end of the middleware stack. In this case, the `next` argument provided when calling the middleware stack from the `onMessage` method is invoked. If it hasn't been provided an empty promise is resolved.


#### Check to ensure `next()` is invoked only once inside each middleware function

```javascript
return function (context, next) {

    let index = -1
    return dispatch(0)

    function dispatch(i) {
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))

        index = i

        let fn = middleware[i]

        try {
            return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
            return Promise.reject(err)
        }

    }
}
```

The `index` variable is used to ensure that `next()` is only invoked once inside each middleware function. It does so by storing the index (in the middleware array) of the last invoked middleware function. 

Consider a middleware stack with 3 functions. And the 2nd function invokes `next` twice

```javascript
function middlewareFunction2(context, next) {
    // Process message
    next();
    next();
}
```
When `middlewareFunction2` is invoked the value of index would be equal to 0. When `middlewareFunction2` invokes next the first time, it will increment index to 1. This will be the end of the stack. When `middlewareFunction2` invokes next again, `index` would be equal to 1, while i would be equal to `2` thus throwing an error as defined in the following line

```javascript
    if (i <= index) return Promise.reject(new Error('next() called multiple times'))
```