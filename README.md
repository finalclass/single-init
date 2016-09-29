SingleInit
==========

Initializer.

Example usage:

```js
var products = new SingleInit(function initFunction(done) {
    db.getProducts(done);
});

products.get(function (err, products) {
    //...
});

//or use promise api:

products.get().then(function (products) {
    //...
}, function onError(err) {
    //...
});

//which is very handy with async/await:

try {
    let products = await products.get();
    let productsGotAgain = await products.get();
    let getThemOnceMore = await products.get();
} catch (err) {
    //on products.get error
}
```

In the above examples `initFunction` will be called only **once**