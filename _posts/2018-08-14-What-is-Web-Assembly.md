---
layout: post
title:  "What is Web Assembly?"
categories: blog
---

I have been coming across the term 'Web Assembly' rather often while browsing HackerNews. I have no idea what it is but from reading off the comments I gather, it's to do with browsers, it's a momentous change and it seems it'll allow to code front-end using languages besides JavaScript.

To get a good overview of what Web Assembly is and why it is such a big deal, I completed a brief course on PluralSight - [WebAssembly: The Big Picture](https://app.pluralsight.com/library/courses/web-assembly-big-picture/table-of-contents)

Here I'm capturing my current understanding of what Web Assembly is.

The web browser today is the most pervasive platform for building applications, running on mobiles, tablets, laptops and desktops. The way I understand, Web Assembly is a tool that allows the browser to run a broader range of applications by removing some of its current limitations

## What is Web Assembly?

> WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine

Web Assembly is binary code that can be executed in the browser (and eventually on other devices that support the web assembly runtime).

## What limitations Web Assembly help overcome?

1. **Performance** - An application running on the browser makes use of HTML, CSS, JavaScript and various Web APIs included in the browser. The performance of the application is strongly coupled to the performance of the JavaScript runtime.

   JavaScript being an interpreted language scores poorly on performance when compared to compiled languages. Also since JavaScript executes in a single thread, computationally intensive tasks can freeze the application and render it unusable. 

   What does Web Assembly do about this? Web Assembly provides a runtime which executes compiled byte code within the browser. This enhances performance and opens up the browser for computationally heavy applications such as audio and video editing, games etc.

   Web Assembly code will also load faster as their binary files will be smaller compared to the textual (minified) javascript files.

2. **Limited to JavaScript to build applications for the browser** - An application running in the browser needs JavaScript to provide user interaction and dynamic functionality. 
   
   Web Assembly removes this language limitation and allows to build the front-end using other programming languages say C#, Rust, C. Different languages will have their individual tool chains to compile programs into byte code that can be executed by the Web Assembly runtime.
   
   Opening up front-end to more languages will help harness the strengths of these individual languages and let more developers write front-end in the language of their choice.

### References

- [How JavaScript works: A comparison with WebAssembly + why in certain cases it’s better to use it over JavaScript](https://blog.sessionstack.com/how-javascript-works-a-comparison-with-webassembly-why-in-certain-cases-its-better-to-use-it-d80945172d79)
- [WebAssembly: The Big Picture](https://app.pluralsight.com/library/courses/web-assembly-big-picture/table-of-contents)
