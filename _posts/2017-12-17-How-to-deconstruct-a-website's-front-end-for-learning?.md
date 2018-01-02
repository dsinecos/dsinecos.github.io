---
layout: post
title:  "How to deconstruct a website's front end for learning?"
categories: blog
---


When I started learning HTML and CSS, for quite a while I felt overwhelmed by all the different tags, attributes, elements, and style options. 

Without a framework to divide the various commands I found it difficult to monitor and prioritize my learning. Over time I learnt to divide the front end for a website/ webpage into the following parts. 

1. Content - This includes the text, audio and video content of the webpage or website

2. Layout - Deconstruct a webpage as an aggregate of rectangles and squares that are placed in a certain layout (It helps to know the box model in HTML/ CSS for this). For instance for the following website 

![Insert Image of Pintext Website]()

I'll try and see the website as an aggregate of boxes stacked in the following layout

![Insert Image of Pintext Website as a layout of boxes]()

(The above image is indicative and I haven't included all the boxes such as the ones for the text fields, labels etc)

3. Color Scheme - What are the colors used for the different elements of the website, the background, the foreground, the text, the logo etc

4. Typography - This deals with the font style, font weight, font size, relative font sizes and weights for the different types of content on the webpage

5. Responsive - This part is about asking how does the page achieve responsiveness and accommodate different screen sizes. I find that this is primarily done in three ways (again it helps to deconstruct and visualize the website as an aggregate of rectangles)

   * As the screen size is reduced the rectangles stack on top of each other. (Add gif)
   * As the screen size is reduced the size of the rectangles reduces proportionally corresponding to the screen size
   * As the screen size is reduced certain rectangles might disappear. Certain kinds of content can be done away with on smaller screens and therefore the rectangles displaying that content are removed on smaller screen sizes  

I was able to classify my HTML/ CSS learning into the above parts after three to four weeks of experimenting with various tags, attributes and properties. With the above framework in mind I was able to divide and prioritize what I had to learn going further. The approach I decided for the different parts were

1. Layout - I found that learning about how the following properties behave and practicing a few layouts would give me a good hang of how to achieve basic layouts
   * Float
   * Position
   * Display

2. Color Scheme and Typography - I decided to use color schemes and typography from various themes or websites when building projects for practice. I did not delve further into understanding the theory behind using colors and typography in websites. I came across a few good resources that explained the basics of these topics for developers which I referred while building my practice projects