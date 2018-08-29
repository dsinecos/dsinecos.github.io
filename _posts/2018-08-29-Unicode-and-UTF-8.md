---
layout: post
title:  "Charsets and Encoding"
categories: blog
---

My run-ins with UTF-8 have so far been when I've copied and pasted a line of code where the encoding is specified as `UTF-8`. I'm writing this post to get a better understanding of what UTF-8 is and what is its significance.

## How are characters stored on the disk?

Data is stored in the form of bits - `0` and `1`. The characters - alphabets, numbers, punctuation etc are all stored as bits. Charsets and encoding are standards which together define how to convert from characters to binary and vice-versa.

There are two stages to converting a character to its binary representation. 

![charset-and-encoding](/assets/charset-and-encoding.svg)

### Character to Code Point

Each character has an integer associated with it which is called the code point. This association is determined by the character set used. For instance Unicode is a character set which provides the code points for different characters.

#### Code Points in Unicode
The code point in Unicode is represented as U+0639 where 'U+' indicates Unicode and '0639' is in hexadecimal. '65' is thus represented as `U+0041` as the Unicode Code Point.

### Code Point to Binary

The next stage determines how the code point (integer) is represented as a binary. This is dictated by the encoding. UTF-8 is an encoding that maps an integer to its corresponding binary representation.
   
It is important to note here that the encoding defines the number of bits used to represent an integer. For instance in ASCII and UTF-8, '65' would be represented as `0b01000001`. In UTF-16 '65' would be represented as `0b0000000001000001`. A code point (integer) therefore can be represented differently as bits depending on the encoding scheme used.

Specifying the encoding is thus essential for a computer to understand how to interpret the bits it's reading. And specifying the incorrect/incompatible encoding can result in garbled text appearing on the screen.

## Reference

- [Characters, Symbols and the Unicode Miracle - Computerphile](https://www.youtube.com/watch?v=MijmeoH9LT4&list=PLzH6n4zXuckqmf_xUcvU5caZVoctP2ehL)
- [The Absolute Minimum Every Software Developer Absolutely, Positively Must Know About Unicode and Character Sets](https://www.joelonsoftware.com/2003/10/08/the-absolute-minimum-every-software-developer-absolutely-positively-must-know-about-unicode-and-character-sets-no-excuses/)

