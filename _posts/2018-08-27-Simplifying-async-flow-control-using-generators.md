---
layout: post
title:  "Simplifying async flow control using generators"
categories: blog
---

I've been trying to understand generators and their use cases. One of its utilities is in improving control flow of asynchronous operations.

I'm writing this post to understand a code snippet posted under this article - [Callbacks vs Coroutines](https://medium.com/@tjholowaychuk/callbacks-vs-coroutines-174f1fe66127). The article goes into the advantages of using generators and coroutines over callbacks.

The code snippet I want to understand 

```javascript
var fs = require('fs');

// Coroutine
function thread(fn) {
  var gen = fn();

  function next(err, res) {
    var ret = gen.next(res);
    if (ret.done) return;
    ret.value(next);
  }
  
  next();
}

function *generator(){
    var a = yield read('hello.txt');
    var b = yield read('world.txt');
    console.log(a);
    console.log(b);
  }

function read(path) {
  return function(done){
    fs.readFile(path, 'utf8', done);
  }
}

thread(generator);
```

I have created two files 'hello.txt' and 'world.txt' with the text, 'hello' and 'world' respectively.

Output

```
hello
world
```

The `readFile` is an asynchronous operation. The following lines of code

```javascript
    var a = yield read('hello.txt');
    var b = yield read('world.txt');
```

are run such that they can be modelled as executing synchronously. The second read operation `read('world.txt')` does not start until the first completes. And it achieves this without building a callback hell.

The code has three functions

`read` - It takes as argument the path of the file to be read. It returns a function which takes the callback `done` for the `readFile` operation.

```javascript
function read(path) {
  return function(done){
    fs.readFile(path, 'utf8', done);
  }
}
```

`*generator` - This is the generator function with the asynchronous code in its yield statements

```javascript
function *generator(){
    var a = yield read('hello.txt');
    var b = yield read('world.txt');
    console.log(a);
    console.log(b);
  }
```

`thread` - This is the control function responsible for invoking the generator

```javascript
function thread(fn) {
  var gen = fn();

  function next(err, res) {
    var ret = gen.next(res);
    if (ret.done) return;
    ret.value(next);
  }
  
  next();
}
```

### `thread` Function execution

```javascript
function thread(fn) {
    var gen = fn();
  
    function next(err, res) { ...
    }
    
    next();
  }
```

It creates an iterator by calling `fn` (which is a generator function). The iterator is stored in the variable `gen`. 

It then invokes the `next` function without any arguments.

### `next` Function execution

```javascript
function next(err, res) {
    var ret = gen.next(res);
    if (ret.done) return;
    ret.value(next);
}
```

`var ret = gen.next(res)` 
 
 => `ret = { value: readFile('hello.txt'), done: false }`
 
 => `ret = { value: function(done){ fs.readFile(path, 'utf8', done); }, done: false }`

Since `ret.done` is `false`, `if (ret.done) return;` has no affect.

`ret.value(next)` results in calling the `readFile` function with `next` as the callback. Thus when the file is read, `next` is invoked with the file data as the argument `res`

### `next` Function execution (as a callback)

When `gen.next(res)` is invoked, it is invoked with the data from the file `hello.txt` which was provided as `res`. This results in `var a = 'hello'` while the value of `ret` updates to

`var ret = gen.next("hello")` 
 
 => `ret = { value: readFile('world.txt'), done: false }`
 
 => `ret = { value: function(done){ fs.readFile(path, 'utf8', done); }, done: false }`

Since `ret.done` is `false`, `if (ret.done) return;` has no affect.

`ret.value(next)` results in calling the `readFile` function with `next` as the callback. Thus when the 'world.txt' is read, `next` is invoked with 'world' as the value for the argument `res`

### `next` Function execution (as a callback)

When `gen.next(res)` is invoked again, it is invoked with the data from the file `world.txt` which was provided as `res`. This results in `var b = 'world'` and

`var ret = gen.next("world")`
 
 => `ret = { value: undefined, done: true }`

As there are no further yield or return statements inside the `generator` function.

Since `ret.done` is `true` the execution breaks out of the `thread` function due to `if (ret.done) return;`



