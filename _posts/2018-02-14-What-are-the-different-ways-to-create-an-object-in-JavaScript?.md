---
layout: post
title:  "What are the different ways to create an object?"
categories: blog
---

### Object Literal Syntax

```javascript
var obj = {
    prop1: 1,
    prop2: 2,
    method1: function() {
        return this.prop1;
    }
}

console.log(obj.__proto__);
console.log(obj.__proto__.__proto__);

```

Output

```
{}
null
```
What does the the __proto__ property point to when creating an object using Object Literal syntax?
As per the above output, it points to the base Object. 

![Prototype Chain using an Object Literal](/assets/PrototypalInheritance/Prototype-Chain-using-an-Object-Literal.png)

### How does a Function and 'new' keyword used to create a new object?

```javascript
function createObj() {
    this.prop1 = 1;
    this.prop2 = 2;
}

var obj2 = new createObj();
```

When the `new` keyword is used, an empty object of type 'createObj' is created. 
```javascript
function createObj() {
    
}

var obj2 = new createObj();

console.log(obj2);
```

Output
```
createObj {}
```

When the function 'createObj' is called after the `new` keyword, the empty object is passed to that function through the `this` keyword. When the function executes it assigns 'prop1' and 'prop2' to the empty object. 

If createObj function does not return any object then this object (with the assigned properties) is returned.  The returned object is referenced using the 'obj2' variable.

```javascript
function createObj() {
    this.prop1 = 1;
    this.prop2 = 2;

    return {
        test: "Hoye"
    }
}

var obj2 = new createObj();

console.log(obj2);
```

Output
```
{ test: 'Hoye' }
```

```javascript
function createObj() {
    this.prop1 = 1;
    this.prop2 = 2;

    return "Hoye";
}

var obj2 = new createObj();

console.log(obj2);
```

Output
```
createObj { prop1: 1, prop2: 2 }
```

The `new` keyword creates an empty object and assigns it to `this` for the function call. If the function does not return any object by default, it returns the object assigned to `this` after execution. The use of `new` with a function to create objects is referred to as Function Constructors in JavaScript

Where does the __proto__ for the object created using a Function Constructor point to?

```javascript
function createObj() {
    this.prop1 = 1;
    this.prop2 = 2;    
}

var obj2 = new createObj();

console.log(obj2);
console.log(obj2.__proto__);
console.log(obj2.__proto__.__proto__);
console.log(obj2.__proto__.__proto__.__proto__);
```

Output
```
createObj { prop1: 1, prop2: 2 }
createObj {}
{}
null
```

The above code helps us to track the prototype chain when creating an object using a Function Constructor in JavaScript. 

![Prototype Chain using a Function Constructor](/assets/PrototypalInheritance/Prototypal-Chain-using-a-Function-Constructor.png)

What is the use of the 'prototype' property available to functions?

'prototype' property is available to all functions in JS but it is useful when using functions as function constructors. When a function is used as a function constructor, the 'prototype' property of the function can be used to manipulate the \__proto\__ object for objects created using that function constructor. 

From the above code output we see that the \__proto\__ object points towards an empty createObj {}. Using the 'prototype' property on a function we can manipulate this empty createObj which forms the first step in the prototypal chain of an object created using 'createObj' function constructor.

How does the prototype property work in a function constructor?

Code

```javascript
function createObj() {
    this.prop1 = 1;
    this.prop2 = 2;    
}

createObj.prototype.test = "Test property";

var obj1 = new createObj();
var obj2 = new createObj();
var obj3 = new createObj();

console.log(createObj.prototype);
console.log(obj1.__proto__);
console.log(obj2.__proto__);
console.log(obj3.__proto__);

console.log(createObj.__proto__);
```

Output

```
createObj { test: 'Test property' }
createObj { test: 'Test property' }
createObj { test: 'Test property' }
createObj { test: 'Test property' }
[Function]
```

![Prototype Method of Function Constructor](/assets/PrototypalInheritance/Prototype-Method-of-Function-Constructor.png)

What is the advantage of assigning methods to the 'prototype' property of the function over assigning them inside the function directly to the object using `this` keyword?

When the 'prototype' property is used to assign methods to new objects, all of those objects refer to a single object which stores those methods. If these methods are assigned from within the function constructor using `this` keyword, each object gets its own copy of the method, thus using more memory.

### Using Object.create to create new objects

Code

```javascript
var Person = {
    firstName: "John",
    lastName: "Doe",
    getFullName: function () {
        return firstName + " " + lastName;
    }
}

var michael = Object.create(Person);

console.log(michael);
console.log(michael.__proto__);
console.log(michael.__proto__.__proto__);
console.log(michael.__proto__.__proto__.__proto__);
```

Output

```
{}
{ firstName: 'John',
  lastName: 'Doe',
  getFullName: [Function: getFullName] }
{}
null
```

![Prototypal Inheritance using Object.create](/assets/PrototypalInheritance/Object_create-Prototypal-Chain.png)

'michael' is an empty object with its \__proto\__ property pointing towards the 'Person' object. The \__proto\__ property of 'Person' object points towards the base JavaScript object where the prototypal chain ends

### Summary

1. Using the object literal method, the created object points towards the base JavaScript object in it's \__proto\__ property

2. Using a Function Constructor and Object.create we can setup the \__proto\__ property for the objects created