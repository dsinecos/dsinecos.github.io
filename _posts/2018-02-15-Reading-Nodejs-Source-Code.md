---
layout: post
title:  "Reading Node.js source code - How to?"
categories: blog
---

While taking a course that explained some of the under-the-hood features of Node.js, I attempted to read the source code myself. 

While I'm a long way from understanding the code, I figured certain approaches which helped me understand different aspects of the code better.

1. Going through the documentation

2. Understanding the structure of a Node.js source file in JavaScript - Using Ctrl + K + 1 shortcut in VS Code collapses all the functions. This helps to get a better idea of the structure of the file.

3. Code patterns -  When I started reading code I came across certain code patterns that I was previously unaware of eg. `var self = this` Learning the purpose of these code patterns made it easier to understand code elsewhere

4. Higher order functions - Functions that return other functions

5. Prototypal Inheritance - Understanding how a class of objects inherits from another and the code pattern used to implement that.

### Going through the documentation
When reading through the documentation the content for a topic can be divided into the following parts

1. What are the classes that have been declared? For instance in [HTTP](https://nodejs.org/dist/latest-v8.x/docs/api/http.html) http.Agent, http.ClientRequest, http.Server, http.ServerResponse and http.IncomingMessage are the classes declared

2. Inside the classes there usually are two parts

    a) Events - This highlights the events to which the objects of this class will respond to

    b) Methods - This lists the methods that can be used on the objects of the classes. This will include both static and instance methods. (Static methods are declared on the class and do not have the context of the object whereas instance methods are methods provided to each object and operate within the context of that object)

### Understanding the structure of a Node.js source file in JavaScript 

Using 'Ctrl + K + 1' shortcut in VS Code when reading the source code - Using this shortcut in VS Code collapses all the functions. This helps to get a better idea of the structure of the file which I was able to separate into 

- Modules required

```javascript
const EE = require('events');
const Stream = require('stream');
const Buffer = require('buffer').Buffer;
const util = require('util');
const debug = util.debuglog('stream');
const BufferList = require('internal/streams/BufferList');
```

- Modules exported

```javascript
module.exports = Readable;
```

- Class declared in the file - This can be identified either by the module that is exported in the file or the function with the following code pattern at its start

```javascript
if (!(this instanceof Readable))
    return new Readable(options);
```

- Class inherited from in the file

```javascript
util.inherits(Readable, Stream);
```

- Methods declared in the file

```javascript
Readable.prototype.push = function(chunk, encoding) {...
}
Readable.prototype.unshift = function(chunk) {...
}
Readable.prototype.isPaused = function() {...
}
```

- Functions performing operations for the methods declared - Functions declared in the file other than the above were usually supporting the methods declared for the class in that file

### Code Patterns

#### Pattern 1

```javascript
var self = this;
```

Purpose -  When a method is called ```this``` refers to the object on which the method is called. However when a function within the method is called ```this``` points at the global object and not the object on which the method was called. Refer the following code snippet and output

Code

```javascript
function Animal(color) {
    this.color = color;
}

Animal.prototype.getColor = function() {
    console.log("The color of this animal is " + this.color);

    insideGetColor();

    function insideGetColor() {
        console.log("The color of this animal from within insideGetColor is " + this.color);
    }
}

var cat =  new Animal("Black");
cat.getColor();
```

Output

```
The color of this animal is Black
The color of this animal from within insideGetColor is undefined
```

#### Pattern 2

```javascript
if (!(this instanceof Readable))
    return new Readable(options);
```

Purpose - For functions that act as object constructors, having the above snippet of code at the start allows to create objects without the `new` keyword. 

It checks if 'this' refers to an object that is an instance of Readable and if it is not calls the function with a new object that is an instance of Readable with the options that were used to call the function originally

#### Pattern 3

```javascript
options = options || {};
```

Purpose - To declare a default value

### Higher order functions

Code Pattern

```javascript
Readable.prototype.unshift = function(chunk) {
  var state = this._readableState;
  return readableAddChunk(this, state, chunk, '', true);
};

```

```javascript
function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {...
  }
  return needMoreData(state);
}

```

```javascript
function needMoreData(state) {...
}

```

Purpose - Having higher order functions that return other functions allows to split code into multiple functions which makes code more manageable. This allows to abstract out duplicate code into a higher order function that returns a more specific function depending upon the arguments provided 