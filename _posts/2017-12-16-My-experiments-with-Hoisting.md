---
layout: post
title:  "My experiments with Hoisting"
---

In case of variables

```javascript
var a = "This should print";

console.log(a);
console.log(b);
console.log(c);

var b = "This will not print";
```

Output

```javascript
This should print
undefined
Reference Error: c is not defined
```

Prior to running the code an execution context is setup. This execution context provides variables, other functions, arguments, closures, and scope for the code to execute within.

The execution context for is setup in two stages

1. Stage 1 - Memory is set aside for variables. However the assignment of values does not happen until the second stage.

2. Stage 2 - During this stage the values are assigned to respective points in the memory against the variables 

This can be understood as when the code is run, all the variables have been given a place in memory but their values are not assigned until the line in the code where the assignment occurs. 

For variable 'a' the space in the memory is allotted and its value is assigned before we print it to screen and so we can see the output as the value assigned to 'a'.

For variable 'b' the space in the memory is allotted but its value is assigned after console.log statement. When a variable has memory allotted it carries the value undefined which is what is printed on the screen.

For variable 'c' since it has not been declared, we get a `Reference Error: c not defined`

In case of functions

```javascript
function d() {
    return "This will print";
}

console.log(d());
console.log(e());

function e() {
    return "This will also print";
}
```

Output

```javascript
This will print
This will also print
```

Hoisting does not have an affect here because the functions are both allotted memory and stored (name and code) in the  memory during Stage 1 of setting up the execution context. Therefore we can call functions which declared later in the code without any error.

Mix of variables and functions

```javascript
var a = function() {
    return "This will print";
}

console.log(a());
console.log(b());

var b = function() {
    return "This will not print";
}
```

Output

```javascript
This will print
TypeError: b is not a function
```

In the above case both the variables ( 'a' and 'b') are allotted space in the memory but only 'a' has been assigned the function. Therefore when we call the functions from the console.log statements, the function assigned to 'a' executes where as 'b' throws an error. Variable 'b' has memory allotted to it but does not have the function assigned to it yet and carries the value 'undefined' which is why we get the TypeError. If we were to move the assignment of variable 'b' before the console.log statement it will print a result as well.

```javascript
var a = function() {
    return "This will print";
}

console.log(a());

var b = function() {
    return "This will also print";
}
console.log(b());
```

Output

```javascript
This will print
This will also print
```

### Conclusion
1. Declare and assign variables before using them. If you use variables before assigning them values they will carry 'undefined' as their value.
2. Functions can be called even if they are declared later in the code