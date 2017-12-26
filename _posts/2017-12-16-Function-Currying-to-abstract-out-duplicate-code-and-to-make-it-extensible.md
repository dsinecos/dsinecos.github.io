---
layout: post
title:  "Function Currying to abstract out duplicate code and to make it extensible"
---

Reference Problem - https://www.hackerrank.com/challenges/apple-and-orange/problem

I attempted the above problem and used function currying to understand currying and closures better. The top submission for this problem uses a simple for loop. Clearly my approach is overkill. 

The idea behind my approach was to have an abstract level function which will return more concrete functions depending upon the parameters provided. 

To check whether a fruit is in the house compound the co-ordinate of the fruit has to fall within the co-ordinate of the house. 

Instead of hardcoding the co-ordinates of the house, I wrote a function which takes as parameters the co-ordinates of the house. It returns a function which then takes the co-ordinates of the fruit and returns whether it fell within the house compound or not

```javascript
function setCoordinateForHouse(houseStartCoordinate, houseEndCoordinate) {
    
    function isFruitInHouse(fruitCoordinate) {
        if(fruitCoordinate >= houseStartCoordinate && fruitCoordinate <= houseEndCoordinate) {
            return true;
        } else  {
            return false;
        }        
    }
    
    return isFruitInHouse;
}
```

Likewise, to get the co-ordinates of the fruit, I wrote a function that takes the co-ordinates of the fruit tree. It returns another function which takes as parameter the distance of the fruit from the tree and returns the co-ordinate


```javascript
function setFruitTreeCoordinate(fruitTreeCoordinate) {
    return function(fruitDistance) {
        
        var fruitPosition = fruitTreeCoordinate + fruitDistance
        
        return fruitPosition;
    }   
}
```

The main function that uses the above functions to return the number of fruits that fell in the house compound

```javascript
function main() {

// s, t are co-ordinates for the house
// a, b are co-ordinates for the fruit tree
// apple and orange are arrays of distance at which the apples and oranges fell from the tree
        
    var isFruitInHouse = setCoordinateForHouse(s, t);
    var getApplePosition = setFruitTreeCoordinate(a);
    var getOrangePosition = setFruitTreeCoordinate(b);
    
    var applePositions = apple.map(getApplePosition);
    var orangePositions = orange.map(getOrangePosition);
    
    var numOfApplesInHouse = applePositions.filter(isFruitInHouse).length;
    var numOfOrangesInHouse = orangePositions.filter(isFruitInHouse).length;
    
    console.log(numOfApplesInHouse);
    console.log(numOfOrangesInHouse);

}
```

The hardcoded approach to this problem using a for loop would have been

```javascript
acount=0
for i in apple:
    if s<=a+i<=t:
        acount+=1
ocount=0
for i in orange:
    if s<=b+i<=t:
        ocount+=1
print acount
print ocount
```

With currying I can add more houses and trees. For every tree or house added I'll have to generate new functions based on the abstract functions by setting new parameters for the co-ordinates for the house or tree. 

In the case of hard coded approach, for every tree added, there will be another for loop and if statement addition to the code. If simultaneously the problem is extended from single to multi dimensions the comparison would have to be changed within each for loop in the condition statement of if.

*Consider there are 'n' different fruit trees and 'm' different houses and we have to find out the number of fruits that have fallen in any house. To find out if a given fruit has fallen into a given house, if we follow the hardcoded approach (using for loop and if statement) we will have to write n * m for loops.*

*With function currying we'll declare m variables, give them the co-ordinates of the respective houses, and get a function that'll return whether a fruit is within its co-ordinates or not given the co-ordinates of the fruit.*

```javascript
var isFruitInHouse1 = setCoordinateForHouse(s1, t1);
var isFruitInHouse2 = setCoordinateForHouse(s2, t2);
var isFruitInHouse3 = setCoordinateForHouse(s3, t3);
.
.
m times
```

*Likewise to find out the positions of the fruits we'll have to declare n variables, give them the co-ordinates of the respective fruit trees, and get a function that'll return the co-ordinates of the fruit given the distance at which the fruit fell from the tree*

```javascript
var getFruit1Position = setFruitTreeCoordinate(a1);
var getFruit2Position = setFruitTreeCoordinate(a2);
var getFruit3Position = setFruitTreeCoordinate(a3);
.
.
n times
```

I feel that with currying these functions can be extended to n dimensions with little repetition of code. Currently the problem is in a single dimension. If I was to increase the complexity of the problem from a single dimension to three dimensions (or n dimensions), in my approach, I'll only have to change code at one point in the abstract functions. Whereas in the hardcoded approach the code will have to changed within each for loop in the condition statement of if. 

My point - While the currying approach is overkill for this problem, if I look at it from the perspective of extending it to more complex problems (by increasing dimensions or by increasing trees or by increasing houses or by increasing all three) code using Function currying can be more easily extended while also maintaining the readability and adherence to the DRY principle. 
