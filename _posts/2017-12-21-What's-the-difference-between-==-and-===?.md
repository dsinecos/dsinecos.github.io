---
layout: post
title:  "Difference between == and ===?"
categories: blog
---

```===``` compares both the data and the type and returns true only if both the data and the type are match 

```==``` coerces if the data types are inconsistent and returns the result comparing the data value

Code

```javascript
console.log("[1]===1 " + ([1]===1));
console.log("[1]==1 " + ([1]==1));
console.log('"1"===1 ' + ("1"===1));
console.log('"1"==1 ' + ("1"==1));
```

Output

```javascript
[1]===1 false
[1]==1 true
"1"===1 false
"1"==1 true
```