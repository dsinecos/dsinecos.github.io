---
layout: post
title:  "How applying `.call` and `util.inherits` affect an object and its prototypal chain?"
categories: blog
---

Code

```javascript
var util = require('util');

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

util.inherits(Person, Vehicle);

var michael = new Person();

console.log(michael);

// // Prototypal Chain for 'michael'
console.log("\nPrototypal Chain for 'michael'");
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
Vehicle { getCar: [Function] }
{}
```

!['michael' object created with `.call(this)` and `util.inherits`](/assets/PrototypalInheritance/After-Applying-Util-Inherits-And-Call-This-Michael.png)

### Summary

1. Extends the prototypal chain

2. Gives access to methods and properties defined inside the function constructor and defined on the prototype property of the function constructor 