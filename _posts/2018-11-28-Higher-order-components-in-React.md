---
layout: post
title:  "Using Higher order components in React"
categories: blog
---

I recently had a use case for Higher Order Components while writing a mobile application in React Native.

While the problem is simple I felt it's well suited for a Higher Order Component.

### Index
- [What are Higher Order Components (HOC)?](#what-are-higher-order-components-hoc)
- [Using a HOC](#using-a-hoc)
- [Higher Order Component to wrap Form field components](#higher-order-component-to-wrap-form-field-components)

<br>

## What are Higher Order Components (HOC)?

HOCs allow to abstract out reusable code. HOCs allow a common functionality to be accessed across without having to rewrite the code for it within each component.

<br>

## Using a HOC

I have written multiple form field components - TextInput, TextAreaInput, RadioInput, CheckBoxInput etc which I intend to reuse.

For a specific project I needed to connect these form field components with redux store so I used `redux-form`. But that led to accepting certain props as `this.props.input.`. 

For instance RadioInput takes an `onChange` prop. Ideally I'd like this to be received as `this.props.onChange`. However to make RadioInput behave well with `redux-form` I was taking the props as `this.props.input.onChange`.

By taking this props from `this.props.input` the RadioInput component becomes tightly coupled to `redux-form` and that makes its reusability cumbersome.

To resolve this I used a Higher Order Component

<br>

## Higher Order Component to wrap Form field components

I wrote a ReduxFormWrapper to connect `redux-form` with the different components. 

It uses object destructuring to provide the props coming from `redux-form` as `this.props.input` available as `this.props`. The child component, RadioInput in this case, does not need to be modified to link with `redux-form`

```javascript
import React, { Component } from 'react';

export default ChildComponent => {
    class ReduxFormWrapper extends Component {
        render() {
            return <ChildComponent {...this.props.input} {...this.props} />
        }
    }

    return ReduxFormWrapper;
}
```