---
layout: post
title:  "Simulating race conditions to understand challenges of multithreading (Golang)"
categories: blog
---

I'm writing this post to better understand the challenges of using the multi-threading model of concurrency. I'm using Go to simulate a multi-threaded processing scenario.

In Golang the `go` keyword is used to create a goroutine or a virtual thread to asynchronously execute a section of code. These goroutines are managed by the Go runtime. The Go runtime decides which goroutine is to be executed at a give moment by allocating them to the threads provided by the operating system. Go runtime manages which goroutine is provided the processor threads for execution.

In a multi-core processor, the Go runtime can have multiple goroutines executing simultaneously by allocating them to the multiple processor threads running across cores.

The following code illustrates the difficulty of modelling a code's behavior when executing on multiple threads

Printing out a series of integers in a single threaded execution

```golang
package main

import (
	"fmt"
	"runtime"
)

func main() {
	runtime.GOMAXPROCS(1)

	for i := 1; i < 6; i++ {

		go func(i int) {
			fmt.Printf("%d; ", i)
		}(i)

	}

	fmt.Scanln()
}
```

Output

```
5; 1; 2; 3; 4;
```

I was expecting the output to be in the increasing order from 1 to 5 but it seems the last goroutine to be invoked was executed first, followed by the rest in order of first invoked, first executed. The point to note is that the execution order remains consistent when the code is run multiple times thus making it possible to model and reason about the code's behavior during execution.

When this code is executed across multiple threads by using multiple cores, the output is different each time the code is executed

The code is modified to `runtime.GOMAXPROCS(4)` to allow the use of multiple cores. Running the code five times resulted in five different outputs

```
2; 1; 5; 4; 3;
2; 3; 1; 4; 5;
2; 1; 4; 3; 5;
2; 1; 4; 3; 5;
1; 4; 3; 2; 5;
```

The unpredictable order of output makes it difficult to reason about the code's behavior during execution. This occurs because multiple goroutines are being executed simultaneously on multiple cores. Whichever goroutine completes execution writes to the console. This introduces an uncertainty in the output (or order of the output). This is also referred to as a race condition.
