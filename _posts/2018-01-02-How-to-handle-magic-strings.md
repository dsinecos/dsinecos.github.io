---
layout: post
title:  "How to handle magic strings in JS"
categories: howto
---

Use a config.js file with the following code

```javascript
module.exports = {
	events : {
		GREET : 'greet'
	}
}

```

Import config.js in your files and use

```javascript

var config = require('config').events;

console.log(config.events.GREET)

```