---
layout: post
title:  "Reading Nodejs source code - Using fn.call to inherit properties and methods from other constructor functions?"
categories: blog
---

Using util.inherits Readable object gets access to all the properties and methods defined on the prototype property of 'Stream' function constructor.

Node.js source code (lib -> _stream_readable.js)
```javascript
function Readable(options) {
.
.
.
.
  Stream.call(this);
}
```

How does `.call(this` affect the above code?

I wrote the following code to understand the point of using `.call(this)`

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
console.log(michael.__proto__);
console.log(michael.__proto__.__proto__);
console.log(michael.__proto__.__proto__.__proto__);
```

Output
```
Person { firstName: 'John', lastName: 'Doe' }
Person { getFullName: [Function] }
{}
null
```

Using `.call(this)`

```javascript
function Person() {
    this.firstName = "John";
    this.lastName = "Doe";

    Vehicle.call(this);
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

var michael = new Person();

console.log(michael);

// Prototypal Chain for 'michael'
console.log("\n Prototypal Chain for 'michael'");
console.log(michael.__proto__);
console.log(michael.__proto__.__proto__);
console.log(michael.__proto__.__proto__.__proto__);
```

Output
```
Person {
  firstName: 'John',
  lastName: 'Doe',
  car: 'Honda',
  wheels: 4,
  getWheels: [Function] }

Prototypal Chain for 'michael'
Person { getFullName: [Function] }
{}
null
```

!['michael' object created without `.call(this)`](/assets/PrototypalInheritance/Before-Applying-Call-This.png)

!['michael' object created with `.call(this)`](/assets/PrototypalInheritance/After-Applying-Call-This.png)

We use `.call` to modify the value of what `this` points to when calling a function. `Vehicle.call(this)` calls the 'Vehicle' function constructor with the object 'michael' in this case. 

Inside the 'Vehicle' function since `this` now points to 'michael' object, as the commands `this.car = "Honda"` and `this.wheels = 4` are executed, these properties are added to the 'michael' object, as we can see from the output.

Using `.call(this)` does not affect the prototypal chain. It only adds properties and methods from the Function constructor which was called. It does not add properties or methods which are on the 'prototype' property of the function constructor. For instance 'michael' object has the properties 'car' and 'wheels' but not the method 'getCar' which is defined on the prototype property of 'Vehicle' function constructor.

If in the above code, we try to call 'getCar' on 'michael' object
```javascript
console.log(typeof michael.getCar);
console.log(michael.getCar());
```

We get an error

Output

```
undefined
TypeError: michael.getCar is not a function
```

If however we call 'getWheels' on the 'michael' object it executes as it was defined within the 'Vehicle' function constructor and so was added to 'michael' object when `Vehicle.call(this)` was executed

```javascript
console.log(typeof michael.getWheels);
console.log(michael.getWheels());
```

Output

```
function
4
```

### Summary
```.call(this)```

1. Gives access to methods and properties defined inside the function constructor

2. Does not affect the prototypal chain

3. Does not borrow properties and methods defined on the prototype property of the function constructor