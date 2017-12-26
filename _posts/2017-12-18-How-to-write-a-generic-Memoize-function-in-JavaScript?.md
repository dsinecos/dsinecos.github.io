---
layout: post
title:  "How to write a generic memoize function in JavaScript?"
---

```javascript
function memoize(fn) {
    var cache = {};

    return function(...args) {
        if(cache[args]) {
            return cache[args];
        }

        cache[args] = fn.apply(this, args);
        return cache[args];
    }
}
```

The above function takes a function 'fn' as an argument and memoizes 'fn'.

It creates an object 'cache' where it stores the result of a function call against the arguments with which the function was called.

Points to Note

1. What I find interesting about the memoize function code is that with this code pattern one can insert another function before another function call. For instance in this case we insert a function to memoize. 

2. ```...args``` - To get arguments when we are not sure of the number of arguments that will be passed to a function. How does this work?

```javascript
function variableArgs(...args) {
    console.log(args);
    console.log(args[0]);
}

variableArgs(1,2, 3,4,5);
variableArgs("This is", {}, [1,2, "asda"]);
```

Output

```javascript
[ 1, 2, 3, 4, 5 ]
1
[ 'This is', {}, [ 1, 2, 'asda' ] ]
This is
```
...args takes all the arguments as an array and they can be accessed like any other array.

3. ```fn.apply(this, args)``` - Why do I need to call fn.apply(this, args) instead of directly calling fn(args)?

In order to find out why we need to use apply instead of calling the function directly I wrote the following program to figure out the difference

```javascript
function testFn(arg1, arg2, arg3, arg4) {
    console.log("The arguments in testFn are");
    console.log(arg1);
    console.log(arg2);
    console.log(arg3);
    console.log(arg4);
}

function memoize(fn) {
    return function(...args) {
        console.log("Calling with apply");
        fn.apply(this, args);
        console.log("Calling without apply");
        fn(args);
	console.log("Calling without apply with the spread operator");
        fn(...args);
    }
}

var memoizeTestFun = memoize(testFn);

memoizeTestFun(1, 2, 3, 4);
```

Output

```javascript
Calling with apply
The arguments in testFn are
1
2
3
4
Calling without apply
The arguments in testFn are
[ 1, 2, 3, 4 ]
undefined
undefined
undefined
Calling without apply with the spread operator
The arguments in testFn are
1
2
3
4
```

When we call the function directly ```fn(args)``` what we pass on to the testFn is an array of the arguments. This is because the memoize function takes its arguments using the rest syntax (```...args```). Thus args is an array of all the arguments. So when the function is called directly instead of passing four separate arguments we end up passing a single argument which is an array of four elements. And since testFn expects four arguments, it places the array as the first argument and the remaining three as undefined as we see from the output

When we call the function using apply ```fn.apply(this, args)``` since args is expected to be an array, the testFn splits the args array into its elements and uses them for the individual arguments ```arg1, arg2, arg3, arg4``` Which is why we can see the respective values assigned in the output

We thus have to use the apply function not to set the ```this``` value but to make sure we do not pass the arguments as an array but split them into the individual elements for the next function to receive.

We can also call the function using the spread operator ```...args``` which splits the array into its elements and calls the function so that testFn receives the individual elements into its respective arguments. As seen in the output for 'Calling without apply with the spread operator'

__Learnt From__

I learnt about the memoize function from : Udemy Course - [The Coding Interview Bootcamp: Algorithms + Data Structures by Stephen Grider (Lecture 56)](https://www.udemy.com/coding-interview-bootcamp-algorithms-and-data-structure/) 