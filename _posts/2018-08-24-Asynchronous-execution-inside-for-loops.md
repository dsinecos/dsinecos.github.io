---
layout: post
title:  "Asynchronous execution inside for loops (Golang and Nodejs)"
categories: blog
---

The following code is written to highlight the challenge of asynchronous execution inside `for` loops using code snippets in Golang and Nodejs

## In Golang

```golang
    package main

    import (
        "fmt"
        "runtime"
    )

    func main() {

        runtime.GOMAXPROCS(1)

        for i := 1; i < 3; i++ {
            for j := 1; j < 3; j++ {
                go func() {
                    fmt.Printf("%d + %d = %d\n", i, j, i+j)
                }()
            }
        }

        fmt.Scanln()
    }
```

Output

*(Note that the program is being executed in a single thread because of this line - `runtime.GOMAXPROCS(1)`). The output will be different if this line is removed as the code (goroutines) can be executed over multiple threads across cores simultaneously*

```
3 + 3 = 6
3 + 3 = 6
3 + 3 = 6
3 + 3 = 6
```

### Understanding code execution in Golang
- When the go code is executed, the main goroutine completes execution before handing over control to other goroutines
- Consequently the two nested for loops complete all their iterations creating a total of 4 child goroutines. Thereafter the execution for the main goroutine pauses at `fmt.Scanln()` which waits for a keystroke. Execution at this point is transferred to the child goroutines
- When the execution of the child goroutines starts, it refers to the variables - `i` and `j` as stored on the main goroutine's execution stack. 
- And after all the iterations the value of `i` and `j` is set at 3 where the execution of both the loops terminated (since it did not satisfy the condition `i < 3`)
- Consequently when the child goroutines are executed they all print `3 + 3 = 6` on the console

To get this program to output

```
1 + 1 = 2
1 + 2 = 3
2 + 1 = 3
2 + 2 = 4
```
We can pass the variables `i` and `j` to the respective functions as arguments when they are invoked as follows

```golang
go func(i int, j int) {
	fmt.Printf("%d + %d = %d\n", i, j, i+j)
}(i, j)
```

Output after the above modification

```
1 + 1 = 2
2 + 2 = 4
2 + 1 = 3
1 + 2 = 3
```

### Understanding code execution after modification
- In the second case, the variables `i` and `j` are no longer referred on the main goroutine's execution stack. 
- Instead these variables have been passed to the functions as arguments and thus are referred on the execution stack of the child goroutines

A similar behavior is observed when executing asynchronous tasks in Nodejs. 

## In Nodejs

```javascript
for(var i=1; i<3; i++) {
    for(var j=1; j<3; j++) {
        setTimeout(() => {
            console.log(i+" + "+j+" = "+(i+j));
        }, 0)
    }
}
```

Output

```
3 + 3 = 6
3 + 3 = 6
3 + 3 = 6
3 + 3 = 6
```

### There are two ways to achieve the following output in Nodejs

```
1 + 1 = 2
2 + 2 = 4
2 + 1 = 3
1 + 2 = 3
```

1. By wrapping setTimeout within a function to which the variables `i` and `j` are passed as arguments
   ```javascript
    (function asynchronous(i, j) {
        setTimeout(() => {
            console.log(i+" + "+j+" = "+(i+j));
        }, 0)
    })(i, j)
   ```

2. By using `let` to declare the variables `i` and `j` which creates block scoped variables
   ```javascript
    for(let i=1; i<3; i++) {
        for(let j=1; j<3; j++) {
            setTimeout(() => {
                console.log(i+" + "+j+" = "+(i+j));
            }, 0)
        }
    }
   ```