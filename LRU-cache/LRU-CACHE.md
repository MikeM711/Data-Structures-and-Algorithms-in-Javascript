# LRU CACHE

### Problem:
* Create a cache for looking up prices of books identified by their ISBN. 
  * You implement lookup, insert, and remove methods. 
* Use the Least Recently Used (LRU) policy for cache eviction. 
* If an ISBN is already present, insert should not change the price, but it should update that entry to be the most recently used entry. 
* Lookup should also update that entry to be the most recently used entry.

### Solution #1: Linked List Queue + Hashtable

The classic solution to this problem is using a combination of a Linked List Queue and a Hashtable. The keys in the hash will be a particular ISBN, and the value of the hash will be that respective ISBN's Linked List pointer, so that we can achieve O(1) access and O(1) search of the Linked List.

* Data Structure Advantages
  * Hashtable advantages: O(1) search, O(1) insertion and O(1) deletion (on average)
  * Linked List Queue advantages: O(1) insertion and O(1) deletion

We could create a solution with just a Linked List Queue, however it will take O(n) access and O(n) search for an ISBN

If you wish for a Linked List library, instead of making one from scratch, check out [Buckets-JS](https://github.com/mauriciosantos/Buckets-JS) - made by a developer over at Amazon.

### Solution #2: JavaScript Maps

Maps function similarly to both a queue and a hashtable.

See: [Maps - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)

> The Map object holds key-value pairs and remembers the original insertion order of the keys.

#### Caveat:

Maps are not "explicitly" stated as O(1) time, they are denoted as "sublinear time"

Taken from [Technical Committee 39 - ECMAScript](https://tc39.es/ecma262/#sec-map-objects)
> Map object must be implemented using either hash tables or other mechanisms that, on average, provide access times that are sublinear on the number of elements in the collection.

[An interesting Map vs Obj benchmark](https://stackoverflow.com/a/54385459)
