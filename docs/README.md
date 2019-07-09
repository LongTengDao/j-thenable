```js

const Thenable = require('@ltd/j-thenable');

console.log(0);

const thenable = new Thenable(function executor (resolve) {
    console.log(1)
    resolve();
    console.log(2);
}).then(function () {
    console.log(3);
});

console.log(4);

thenable.then(function () {
    console.log(5);
})

console.log(6);

```