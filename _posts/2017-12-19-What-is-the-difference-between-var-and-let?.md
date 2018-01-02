---
layout: post
title:  "What is the difference between var and let"
categories: blog
---

Code

```javascript
var a = 10;
var b;
let c = 20;
let d;

console.log(a);
console.log(b);
console.log(c);
console.log(d);
```

Output

```javascript
10
undefined
20
undefined
```

Code

```javascript
console.log(a);
console.log(b);

var a = 10;
let b = 20;
```

Output
```javascript
undefined
ReferenceError: b is not defined
```

```console.log(a)``` outputs undefined because of hoisting (a is alloted space in the memory but its value has not been assigned) 

Where as in case of ```let``` it cannot be used until the it has been both declared and assigned a value . Since ```console.log(b)``` occurs before declaration and assignment ```let b = 20``` we get ```Reference error: b is not defined```

#### Problem - Explain the difference in output using ```var``` and ```let```

```javascript
for(var i = 0; i < 5; i++) {
    setTimeout(function(){
        console.log(i);
    }, 100);
}

for(let i = 0; i < 5; i++) {
    setTimeout(function(){
        console.log(i);
    }, 100);
}
```

Output

```javascript
5
5
5
5
5
0
1
2
3
4
```

In the first for loop, the functions are placed in the event queue and when the first of them is pulled out of the queue and executed, the value of ```var i``` is equal to 5 in that execution context. Therefore we get the result as 5 printed five times. In this case all of the functions point to a single 'i' variable which is incremented in each cycle of the for loop and therefore end up printing 5, five times as that is the final value of 'i' in memory when the functions start executing from the event queue. 

My current understanding is that ```let``` creates a new variable (pointing to a new place in the memory) each time the for loop is run. There are thus five variables in that execution context named 'i' each pointing at a different location in memory. Therefore when the function is put on to event queue it points to a unique 'i' in the memory carrying the value of 'i' during that loop.

#### Query
*I don't understand how ```let``` is working in each for loop. If ```let``` creates a new 'i' in each for loop why doesn't that 'i' have the value of zero or undefined instead of the incremented value during that for loop. Where does 'i' get assigned the value as in the current for loop?*

