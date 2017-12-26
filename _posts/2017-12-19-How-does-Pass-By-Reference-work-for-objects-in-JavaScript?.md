---
layout: post
title:  "How does Pass by Reference work for objects in JavaScript?"
---

I was learning to implement a Linked List where in I got confused about how objects are passed by reference in JavaScript. Skip to experiment section 

### Problem

```
class Node {
    constructor(data, nextNode = null) {
        this.data = data;
        this.next = nextNode;
    }
}

class LinkedList {
    constructor() {
        this.head = null;
    }

    insertFirst(data) {

        // Stepehen Grider's implementation
        const node = new Node(data, this.head);
        this.head = node;
    }
}

const nodeOne = new Node({name: 'Inserted already'});
const list = new LinkedList();

list.head = nodeOne;
list.insertFirst({hoye: "Inserted next"});

console.log(list);
```

Output

```javascript
LinkedList {
  head:
   Node {
     data: { hoye: 'Inserted next' },
     next: Node { data: [Object], next: null } } }
```

After list.head is assigned the value of nodeOne, it carries a reference to the nodeOne object. Next when the insertFirst command is used, another node is created.

My question is does the next property of this node point to list.head which in turn points to nodeOne object or the next property of the new node is directly assigned the reference within list.head which is the reference of nodeOne object?

If it was the first, that is the next property of the new node pointed to list.head which in turn pointed to nodeOne, when list.head is reassigned, the next property would also get reassigned and it would basically result in a circular reference. Since this did not happen the case should be latter ie next property of the new node is directly assigned the reference within list.head which is the reference of nodeOne object which is why it remains unaffected even when list.head is reassigned.

### Experiment

I wrote the following code to understand how pass by reference works in case of objects in JavaScript

```javascript
var objB = {
    name: "B"
};

var objA = {
    name: "A",
    link: objB
};

console.log(objA.link);

objB = {
    name: "Modified B"
};

console.log(objA.link);
```

Output

```javascript
{ name: 'B' }
{ name: 'B' }
```

var objB stores the reference to the object ```{ name: "B" }```. This reference is set when ```objA.link``` is assigned the value of variable objB. 

Next we change the value of objB and assign it the reference to a new object ```{ name: "Modified B" }``` Here we have changed the reference stored in variable objB but it does not affect the link property of objA which carries a reference to the earlier object.

With an array

```javascript
var objB = {
    name: "B"
};

var outLink = [objB]

console.log(outLink);

objB = {
    name: "Modified B"
};

console.log(outLink);
```

Output

```javascript
[ { name: 'B' } ]
[ { name: 'B' } ]
```

I wrote more code to understand how pass by reference works 

```javascript
var obj = {
    name: "Object 1"
}

var link1 = obj;
var link2 = link1;

console.log("After assigning")
console.log(obj);
console.log(link1);
console.log(link2);

obj = {
    name: "Modified Object 1"
}

console.log("After modifing obj")
console.log(obj);
console.log(link1);
console.log(link2);

link1 = {
    name: "Modfied Object Link1"
}

console.log("After modifying var link1")
console.log(obj);
console.log(link1);
console.log(link2);
```

Output

```javascript
After assigning
{ name: 'Object 1' }
{ name: 'Object 1' }
{ name: 'Object 1' }
After modifing obj
{ name: 'Modified Object 1' }
{ name: 'Object 1' }
{ name: 'Object 1' }
After modifying var link1
{ name: 'Modified Object 1' }
{ name: 'Modfied Object Link1' }
{ name: 'Object 1' }
```

The way I understand the results here is that  var ```obj1``` stores the reference of the original object ```{ name: "Object1 }``` Variable ```link1``` stores the reference to the original object in memory  ```{ name: "Object1 }``` and not the reference to variabled ```obj1```. Likewise var ```link2``` stores the reference to the original object stored in var ```link1``` and not a reference to variable ```link1```.

It is because of this that when I reassign the values of ```obj```, the output for ```link1``` and ```link2``` are unaffected. Likewise when I reassign the value of ```link1``` the value of ```link2``` is unaffected.

### Conclusion 
When passing by reference you store the reference to the end object and not to the variable that carries the reference to that object.

### What is the effect of the above conclusion on writing code?

When we create a module we export functions using ```module.exports = function() {}``` or ```exports.propertyName = function() {}``` We don't export functions using ```exports = function() {}```. 

This is because when a module is imported it is wrapped as an IIFE (Immediately Invoked Function Expression). This IIFE has ```exports``` as an argument which has a value passed to it by reference from the Node source code. If we were to assign a value to ```exports``` directly we would end up changing what ```exports``` points to without modifying what the object that was passed to ```exports``` in the argument. 

The effect would be similar to how it is in the following code

```javascript
var obj = {
    name: "How exports works?"
};

function passByReference1 (dummyExports) {
    dummyExports = function() {

    } 
}

passByReference1(obj);
console.log(obj);

function passByReference2 (dummyExports) {
    dummyExports.fn = function() {

    }
}

passByReference2(obj);
console.log(obj);
```

Output

```javascript
{ name: 'How exports works?' }
{ name: 'How exports works?', fn: [Function] }
```

In the first case ```passByReference1``` ```obj``` is unaffected by the assignment of the ```dummyExports``` argument. In the second case ```passByReference2``` ```obj``` is assigned the function against the property name ```fn```.

When we use ```exports.propertyName``` since exports has a reference to the object passed to it in argument, we attach the ```propertyName``` to that object using its reference in exports. 

__Learnt From__

I was learning about Linked Lists that triggered this question : [Udemy Course - The Coding Interview Bootcamp: Algorithms + Data Structures by Stephen Grider](https://www.udemy.com/coding-interview-bootcamp-algorithms-and-data-structure/) (Section 21)

I learned about Modules and export from [Udemy Course - Learn and Understand NodeJS by Anthony Alicea](https://www.udemy.com/understand-nodejs/)