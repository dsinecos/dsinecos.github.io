---
layout: post
title:  "Using Bitmasks and Binary operations in JavaScript"
categories: blog
---

One of the problems I attempted on HackerRank had an elegant solution using bitmasks. I don't remember the problem any more, but I do remember struggling with binary calculations in JavaScript. I'm writing this post as I experiment with binary operations in JavaScript and get an understanding of bitmasks and their uses

### Prerequisites
1. Binary number representation
2. Conversion from binary to decimal number representation

### Learning objectives
1. Represent binary numbers in JavaScript
2. Use bitmasks to store boolean values
3. Binary operations AND, OR and XOR and their relevance when storing boolean values in bitmasks

## Representing Binary numbers in JavaScript

To represent binary numbers in JavaScript prefix the binary notation of a number with `0b`

```javascript
const x = 0b001;
const y = 0b010;
const z = 0b100;

console.log('x = ', x);
console.log('y = ', y);
console.log('z = ', z);
```
 Outputs to

 ```
 x = 1

 y = 2

 z = 4
 ```
 
## Bitmasks and Binary operations

A bitmask is a series of bits that can be used to represent multiple boolean flags in a single variable. 

An apt use case for a bitmask is in representing user permissions for a resource, say read/ write permissions for a file.

In the following example we write a class to create users.

```javascript
function User(name, userType) {
    this.name = name;
    this.permissions = this.userType(userType); // 0b WRITE_PERMISSSION READ_PERMISSION
}
```

We define two properties for each user `name` and `permissions`. The `permissions` property is used to specify whether that user is allowed to 'read' and 'write' to files. 

We define the `permissions` variable as a two bit binary number `0bxy` where the bit at `x` indicates the write permission and the bit at `y` indicates the read permission

We use the `userType` function to initialize the permissions for the user.

```javascript
User.prototype.userType = function (userType) {
    switch (userType) {
        case 'ADMIN':
            return 0b11;
        case 'COMMON':
            return 0b01;
        default:
            return 0b00;
    }
}
```

In the above function, for a user of type 'ADMIN' we return the binary number `0b11` which indicates `true` for both read and write flags. For a user of type 'COMMON' we return the binary number `0b01` which indicates only read permission but no write permission. For users of any other type, we return the binary number `0b00` indicating no read or write  permissions.

## Binary Operations AND, OR and XOR

### AND `&` - Querying the status of a bit

Once we have assigned the users their respective permissions, we would like to invoke functions that allows them to read and write to files. 

The following dummy functions for reading and writing to files check if the user is authorized for the operation and return a response accordingly.

```javascript
User.prototype.readFile = function () {
    if (this.permissions & 0b01) {
        return 'Hello World !'
    } else {
        return `${this.name} is not authorized to read file`
    }
}

User.prototype.writeFile = function () {
    if (this.permissions & 0b10) {
        return 'Written to file';
    } else {
        return `${this.name} is not authorized to write to file`
    }
}
```
### What does `this.permissions & 0b01` do?

`this.permissions & 0b01` invokes the AND operator on two binary numbers - `0b01` and the binary number representing permissions. The `&` operator is useful when you want to query the status of a bit.

To query the status of a bit we `&` it with `1` at that bit's position. We keep the remaining bits `0`.

To query the read permission of a user, we `&` the permissions binary with `0b01`. Similarly to query the write permission of a user we `&` the permissions binary with `0b10`.

Let's create a couple of users and invoke the `readFile` and `writeFile` methods

```javascript
const Jane = new User('Jane', 'ADMIN');

console.log(Jane.name);
console.log(Jane.readFile());
console.log(Jane.writeFile());
```
Output
```
Jane
Hello World !
Written to file
```

As expected, the user Jane is an ADMIN and has both read and write permissions enabled and thus was able to successfully read and write to files.

Let's create a 'common' user wth only read permission enabled and invoke the `readFile` and `writeFile` methods

```javascript
const John = new User('John', 'COMMON');

console.log(John.name);
console.log(John.readFile());
console.log(John.writeFile());
```
Output
```
John
Hello World !
John is not authorized to write to file
```

As John does not have the write permission enabled, we get the response 'John is not authorized to write to file'.

### OR `|` - Switching the status of a bit from 0 to 1

Can we give John, a 'common' user write permission using binary operations on the `permissions` property?

OR, `|` operator allows to switch the status of a bit from 0 to 1 by applying `|` operator with `1` at that bit's position. It is important to keep the remaining bits `0` to leave the other permission bits unaffected.

To enable the write permission bit of John

```javascript
User.prototype.enableWritePermission = function () {
    this.permissions = this.permissions | 0b10
}
```

```javascript
John.enableWritePermission();

console.log(John.name);
console.log(John.writeFile());
```
Outputs
```
John
Written to file
```

By using the `|` operator, we enabled the write permission for 'John'

### AND `&` - Switching the status of a bit from 1 to 0

Earlier we used the AND operator to query the status of a bit. When we `&` with `1` at a bit's position we retrieve the status of that bit. We can also use AND to switch the status of a bit to 'OFF' by applying the `&` operator with `0` at the bit's position which we want to switch OFF. The remaining bits should be `1` so the remaining permission bits are unaffected by this operation.

Let us disable the write permission for John

```javascript
User.prototype.disableWritePermission = function () {
    this.permissions = this.permissions & 0b01
}
```

```javascript
John.disableWritePermission();
console.log(John.name);
console.log(John.writeFile());
```
Outputs
```
John
John is not authorized to write to file
```

### XOR `^` - Toggling the status of a bit

Another useful operation when storing boolean values in bitmasks is the ability to toggle a bit. Switch a bit from 'ON' (`1`) to 'OFF'(`0`) or vice versa.

The XOR, `^` operator can be used to toggle the status of a bit by applying `^` with `1` at the position of the bit that is to be toggled. Keep the remaining bits `0` to leave them unaffected from the XOR operation.

Let's create a user with no permissions and then toggle both its permissions at once to enable read and write operations.

```javascript
const Stranger = new User('Stranger', '');

console.log(Stranger.name);
console.log(Stranger.readFile());
console.log(Stranger.writeFile());
```
Outputs
```
Stranger
Stranger is not authorized to read file
Stranger is not authorized to write to file
```

Let's define a function to toggle a user's permissions
```javascript
User.prototype.toggleAllPermissions = function () {
    this.permissions = this.permissions ^ 0b11
}
```
Here we toggle both read and write permission by `XOR`ing with `0b11`.

Let's try to write and read after toggling Stranger's permissions

```javascript
Stranger.toggleAllPermissions();

console.log("After toggling permissions");
console.log(Stranger.readFile());
console.log(Stranger.writeFile());
```
Outputs
```
After toggling permissions
Hello World !
Written to file
```

We successfully switched both the read and write permissions to 'ON' for the stranger. Let's toggle them once more to see if we can switch the permission bits to 'OFF' state or `0`

```javascript
Stranger.toggleAllPermissions();

console.log("After toggling permissions");
console.log(Stranger.readFile());
console.log(Stranger.writeFile());
```
Outputs
```
After toggling permissions
Stranger is not authorized to read file
Stranger is not authorized to write to file
```

Using the XOR operator we successfully toggled the read and write permissions from 'OFF' to 'ON' and back.

## Summary

1. To represent binary numbers in JavaScript add a `0b` prefix before the binary number representation eg. `0b01` for 1, `0b10` for 2 and so on
2. To query the status of a bit, apply `&` with `1` at the position of the bit whose status you want to query. (Keep the remaining bits `0`) 
3. To switch the status of a bit to 'ON' or `1`, apply `|` with `1` at the position of the bit whose status you want to switch to 'ON'. (To leave the other bits unaffected in the operand keep the remaining bits `0`)
4. To switch the status of a bit to 'OFF' or `0`, apply `&` with `0` at the position of the bit whose status you want to switch to 'ON'. (To leave the other bits unaffected in the operand keep the remaining bits `1`)
5. To toggle the status of a bit, apply `^` with `1` at the position of the bit whose status you want to toggle. (To leave the other bits unaffected in the operand keep the remaining bits `0`)


### References

1. [Github Code for this Post](https://github.com/dsinecos/learnBinaryOperations)
1. [Mask - Wikipedia](https://en.wikipedia.org/wiki/Mask_%28computing%29)
2. [Juggling bits in JavaScript: bitmasks](https://blog.rinatussenov.com/juggling-bits-in-javascript-bitmasks-128ad5f31bed)
3. [Bitmask - why, how and when](https://alemil.com/bitmask)
4. [Binary numbers in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Numbers_and_dates#Binary_numbers#Binary_numbers)