/*
To illustrate LRU cache, we will use a Map to store ISBNs
*/

function LruCache(capacity) {
    this.isbnToPrice = new Map();
    this.capacity = capacity;
}

LruCache.prototype.lookup = function (isbn) {
    if (this.isbnToPrice.has(isbn) === false) {
        return undefined;
    }
    // Get the price of the isbn, because:
    // 1. we are preparing to delete AND THEN set it back in (to move this isbn to the end of the queue)
    // 2. because the user requested it
    const price = this.isbnToPrice.get(isbn);

    this.isbnToPrice.delete(isbn);
    this.isbnToPrice.set(isbn, price);
    return price;
};

LruCache.prototype.insert = function (isbn, price) {
    // we add the value for key only if key is not present - we don't update existing values
    if (this.isbnToPrice.has(isbn) === true) {
        // if the value is present, we will delete it
        // Future: we will add it back into the Map queue
        this.isbnToPrice.delete(isbn);
    } else if (this.isbnToPrice.size === this.capacity) {
        // delete the first entry of the Map
        for (const pair of this.isbnToPrice) {
            this.isbnToPrice.delete(pair[0]);
            break;
        }
    }
    this.isbnToPrice.set(isbn, price); // add isbn/price to hash
};

LruCache.prototype.erase = function (isbn) {
    if (this.isbnToPrice.has(isbn) === true) {
        this.isbnToPrice.delete(isbn);
    } else {
        throw new Error("This ISBN is not found in the cache");
    }
};

LruCache.prototype.print = function () {
    this.isbnToPrice.forEach((value, key) => {
        console.log("key: ", key, " value: ", value);
    });
};

let cache = new LruCache(5);

cache.insert("1", "$25.00");
cache.insert("2", "$26.00");
cache.insert("3", "$27.00");
cache.insert("4", "$28.00");
cache.insert("5", "$29.00");
cache.insert("6", "$39.00");
cache.lookup("2");
cache.insert("7", "$999");
cache.erase("6");
cache.insert("8", "$88.88");
cache.insert("9", "$99.99");
cache.print();

/*
key:  5  value:  $29.00
key:  2  value:  $26.00
key:  7  value:  $999
key:  8  value:  $88.88
key:  9  value:  $99.99
*/
