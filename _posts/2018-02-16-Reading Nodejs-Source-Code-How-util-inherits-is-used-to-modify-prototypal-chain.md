---
layout: post
title:  "Reading Nodejs source code - How util.inherits affects the prototypal chain?"
categories: blog
---

### How util.inherits works?

Node.js source code (lib -> util.js -> exports.inherits)

```javascript
exports.inherits = function(ctor, superCtor) {

  if (ctor === undefined || ctor === null)
    throw new TypeError('The constructor to "inherits" must not be ' +
                        'null or undefined');

  if (superCtor === undefined || superCtor === null)
    throw new TypeError('The super constructor to "inherits" must not ' +
                        'be null or undefined');

  if (superCtor.prototype === undefined)
    throw new TypeError('The super constructor to "inherits" must ' +
                        'have a prototype');

  ctor.super_ = superCtor;
  Object.setPrototypeOf(ctor.prototype, superCtor.prototype);
};
```

Use of util.inherits in _stream_readable.js

```javascript
util.inherits(Readable, Stream);
.
.
.
```

![A Readable object's Prototypal Chain before applying util.inherits](/assets/PrototypalInheritance/Before-Applying-Util-inherits.png)

![A Readable object's Prototypal Chain after applying util.inherits](/assets/PrototypalInheritance/After-Applying-Util-inherits.png)

util.inherits is used to extend the prototypal chain using another function constructor's prototype property

In the case of ```util.inherits(Readable, Stream)``` 'Readable' becomes the 'ctor' and 'Stream' becomes the 'superCtor'.

```Object.setPrototypeOf(ctor.prototype, superCtor.prototype)``` sets the \__proto\__ property of Readable's prototype property (which is an object) to the prototype property of `Stream`, a function constructor.  

To understand how ```util.inherits``` works better I wrote the following code

Code

```javascript
function Person() {
    this.firstName = "John";
    this.lastName = "Doe";
}

Person.prototype.getFullName = function() {
    return this.firstName + " " + this.lastName;
}

var michael = new Person();

console.log(michael);

// Prototypal Chain for 'michael'
console.log("\nPrototypal Chain for 'michael'");
console.log(michael.__proto__);
console.log(michael.__proto__.__proto__);
console.log(michael.__proto__.__proto__.__proto__);
```

Output

```
Person { firstName: 'John', lastName: 'Doe' }

Prototypal Chain for 'michael'
Person { getFullName: [Function] }
{}
null
```

Code

```javascript
var util = require('util');

function Person() {
    this.firstName = "John";
    this.lastName = "Doe";
}

Person.prototype.getFullName = function() {
    return this.firstName + " " + this.lastName;
}

function Vehicle() {
    this.car = "Honda";
    this.wheels = 4;

    this.getWheels = function() {
        return this.wheels;
    }
}

Vehicle.prototype.getCar = function() {
    return this.car;
}

util.inherits(Person, Vehicle);

var michael = new Person();

console.log(michael);

// Prototypal Chain for 'michael'
console.log("\nPrototypal Chain for 'michael'");
console.log(michael.__proto__);
console.log(michael.__proto__.__proto__);
console.log(michael.__proto__.__proto__.__proto__);
```

Output

```
Person { firstName: 'John', lastName: 'Doe' }

Prototypal Chain for 'michael'
Person { getFullName: [Function] }
Vehicle { getCar: [Function] }
{}
```

!['michael' object created without util.inherits](/assets/PrototypalInheritance/Before-Applying-Util-inherits-michael.png)
!['michael' object created with util.inherits](/assets/PrototypalInheritance/After-Applying-Util-inherits-michael.png)

### Summary

```util.inherits()```

1. Gives access to methods and properties defined on the prototype of the Function constructor

2. Affects the prototypal chain

3. Only adds properties and methods that are defined on the prototype of the Function constructor

4. Does not add properties or methods defined inside the Function Constructor