---
layout: post
title:  "How bitwise NOT works in JavaScript?"
categories: blog
---

While writing a blog post on [Bitmasks]() I realized my current mental model of how the NOT operator works is flawed.

I expected the NOT operator to flip the bits ie to switch `0` to `1` and `1` to `0`. I expected `~0b10` (2 in decimal number representation) to output `1` (`0b01` in binary representation). Instead it returned `-3`

### Learning Objectives
1. How does the bitwise NOT operator work in JavaScript?
2. How negative numbers are stored in memory?

In JavaScript, the bitwise logical operators (AND, OR, NOT etc) convert the operands to 32 bits. Therefore the operation `~0b10` is being applied to `~0b 00000000 00000000 00000000 00000010`. 

When the NOT operator is applied, as expected it flips the bits - `0` to `1` and `1` to `0`. This results in the following intermediate result `0b 11111111 11111111 11111111 11111101`. 

The intermediate result is then converted to its corresponding integer and logged to the console. To understand how this yields `-3` we need to understand 

## How negative numbers are stored in memory?

Negative numbers are indicated by using the most significant bit ie the leftmost bit of a binary number. `1` on the most significant bit indicates a negative integer while `0` indicates positive.

To calculate the binary representation of a negative number, the 2's complement of its positive counterpart is calculated which involves two operations

- Calculate the 1's complement of the positive number ie flip the bits - `0` to `1` and `1` to `0`
- Add `1` to the result of 1's complement

Let's calculate the binary representation of `-3`
<br>

| Bitwise operation | Result |
| :--- | :---: |
| Binary representation of 3 (in 32 bits) | `0b 00000000 00000000 00000000 00000011` |
| 1's complement of 3 | `0b 11111111 11111111 11111111 11111100` |
| Adding 1 | `0b 11111111 11111111 11111111 11111101` |

--- 

<br>
The final result `0b 11111111 11111111 11111111 11111101` which is the binary representation of `-3` is the same as the result of applying the NOT operator on the 32 bit representation of 2 explaining why `~0b10` yielded `-3`

## References
- [How integers are stored in memory using two’s complement](https://medium.com/@LeeJulija/how-integers-are-stored-in-memory-using-twos-complement-5ba04d61a56c)
- [Bitwise operators - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT)
