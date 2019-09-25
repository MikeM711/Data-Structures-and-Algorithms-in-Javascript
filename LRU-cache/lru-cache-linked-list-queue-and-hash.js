/*
To illustrate LRU cache, we will use a Linked List and a Hash to store ISBNs
*/

// Linked List Queue

function LinkedListQueue() {
    this.front = null;
    this.back = null;
    this.capacity = 0; // $$
}

// Add elements to queue in O(1) time
LinkedListQueue.prototype.enqueue = function (element) {
    // when we enqueue, we will increment the capacity
    this.capacity++;
    const N = {
        data: element,
        next: null
    };
    if (this.back === null) {
        const location = this.back;
        this.front = N;
        this.back = N;
        return location; // Return a pointer pointing to the node before the node we added
    } else {
        location = this.back;
        this.back.next = N;
        this.back = this.back.next;
        return location; // Return a pointer pointing to the node before the node we just added
    }
};

// Remove first element from queue in O(1) time
LinkedListQueue.prototype.dequeue = function () {
    if (this.front !== null) {
        // when we dequeue, we will decrease the capacity
        this.capacity--;
        const first = this.front;
        this.front = this.front.next;
        return first.data;
    } else {
        if (this.back !== null) {
            this.back = null;
        }
        return "Cannot dequeue because queue is empty";
    }
};

// Given a location, we remove a value in O(1) time
LinkedListQueue.prototype.remove = function (location) {
    // when we remove, we will decrease the capacity
    this.capacity--;
    // case: removing the head node
    if (location === null) {
        this.front = this.front.next;
    } else {
        // takes care of all middle nodes AND back node
        location.next = location.next.next;
    }
};

// LRU Cache

function LruCache(capacity) {
    this.isbnToPriceQueue = new LinkedListQueue(); // Allows O(1) time for enqueue and dequeue and removal of any node
    this.isbnToPriceHash = {}; // Allows O(1) time to search
    this.capacity = capacity;
}

LruCache.prototype.lookup = function (isbn) {
    if (this.isbnToPriceHash[isbn] === false) {
        return undefined;
    }
    // Get the price of the isbn, because
    // 1. Queue: we are preparing to delete the isbn AND THEN set it back in (to move this isbn to the end of the queue as “Most Recently Used”)
    // 2. Because the user requested the price upon "lookup"

    const price = this.isbnToPriceHash[isbn].price;
    const location = this.isbnToPriceHash[isbn].location; // Store location pointer in particular isbn hash bucket

    this.isbnToPriceQueue.remove(location);
    this.isbnToPriceQueue.enqueue(isbn);
    return price;
};

LruCache.prototype.insert = function (isbn, price) {
    // we add the value (price) for the key only if key is not present

    // Case: the bucket IS present
    if (this.isbnToPriceHash[isbn] !== undefined) {
        // if the value is present, we will delete the item from the queue using its pointer (for O(1) time), and then add it back into our queue as the MRU

        const isbnQueueLocation = this.isbnToPriceHash[isbn].location;
        this.isbnToPriceQueue.remove(isbnQueueLocation);
    } else if (this.isbnToPriceQueue.capacity === this.capacity) {
        // Case: the bucket is not present, BUT we have reached capacity

        // Dequeue the first entry in the linked list
        // Dequeuing returns the value that has been dequeued
        const isbnDequeued = this.isbnToPriceQueue.dequeue();
        // find that "dequeued" return value in the hash and delete it in our hash
        delete this.isbnToPriceHash[isbnDequeued];
    }

    // We will add the isbn to the queue AND to the hash (along with identifying information)
    const queueLocation = this.isbnToPriceQueue.enqueue(isbn); // add isbn to queue, get a location back
    this.isbnToPriceHash[isbn] = { price: price, location: queueLocation }; // add isbn,price, queue location to hash
};

LruCache.prototype.erase = function (isbn) {
    if (this.isbnToPriceHash[isbn] !== undefined) {
        // the isbn is found in the hash, let's erase it from both the hash AND linked list queue
        const location = this.isbnToPriceHash[isbn].location;
        this.isbnToPriceQueue.remove(location);
        delete this.isbnToPriceHash[isbn];
    } else {
        throw new Error("This ISBN is not found in the cache");
    }
};

// Print function
LruCache.prototype.print = function () {
    console.log("The cache queue, from Least to Most Recently Used:");
    let currPointer = this.isbnToPriceQueue.front;

    while (currPointer !== null) {
        console.log(currPointer.data);
        currPointer = currPointer.next;
    }

    console.log("ISBNs in hash table, for O(1) lookup (not in order)");
    for (var isbnBucket in this.isbnToPriceHash) {
        var price = this.isbnToPriceHash[isbnBucket].price;
        console.log("ISBN: ", isbnBucket, "Price: ", price);
    }
};

let cache = new LruCache(5);

cache.insert("1", "$25.00"); // Queue: 1
cache.insert("2", "$26.00"); // Queue: 1 => 2
cache.insert("3", "$27.00"); // Queue: 1 => 2 => 3
cache.insert("4", "$28.00"); // Queue: 1 => 2 => 3 => 4
cache.insert("5", "$29.00"); // Queue: 1 => 2 => 3 => 4 => 5
cache.insert("2", "$4.00"); // Queue: 1 => 3 => 4 => 5 => 2
cache.lookup("1"); // Queue: 3 => 4 => 5 => 2 => 1
cache.erase("2"); // Queue: 3 => 4 => 5 => 1
cache.insert("6", "$6.66"); // Queue: 3 => 4 => 5 => 1 => 6
cache.insert("7", "$7.00"); // Queue: 4 => 5 => 1 => 6 => 7
cache.print();

/*
The cache queue, from Least to Most Recently Used:
4
5
1
6
7
ISBNs in hash table, for O(1) lookup (not in order)
ISBN:  1 Price:  $25.00
ISBN:  4 Price:  $28.00
ISBN:  5 Price:  $29.00
ISBN:  6 Price:  $6.66
ISBN:  7 Price:  $7.00
*/