## What is Promise?

- The Promise object represents the eventual completion (or failure) of an asynchronous operation and its resulting value.

- States: Pending, Fulfilled, Rejected

- A promise is said to be settled when it is either fulfilled or rejected.

## Skeleton of Promise

- It takes callback as input. This callback took by constructor function.
- Has methods like .then(), .catch(), .finally()

```js
const promise = new Promise((resolve, reject) => {
  /*
     Your code logic goes here and you call  resolve(value)
     or reject(error) to resolve or reject the promise
   */
});

promise
  .then((value) => {
    // Code logic on success of an operation
  })
  .catch((error) => {
    // Code logic on failure of an operation
  })
  .finally(() => {
    // Code logic to be executed after completion of operation
  });
```

Now move to implementation....

## then() method implementation

- `then()` method takes two arguments as callbacks `onSuccess` and `onFail`.
- onSuccess is called if Promise was fulfilled and onFail is called if Promise was rejected.

> “Remember that Promises can be chained”.
>
> The essence of Promise chaining is that the then() method returns a new Promise object. That is how promises can be chained. This is specially useful in scenarios where we need to execute two or more asynchronous operations back to back, where each subsequent operation starts when the previous operation succeeds, with the result from the previous step.

## finally()

> MDN
> The finally() method returns a Promise. When the promise is settled, i.e either fulfilled or rejected, the specified callback function is executed. This provides a way for code to be run whether the promise was fulfilled successfully or rejected once the Promise has been dealt with.
>
> The finally() method is very similar to calling .then(onFinally, onFinally) however there are a couple of differences:
>
> When creating a function inline, you can pass it once, instead of being forced to either declare it twice, or create a variable for it
>
> Unlike Promise.resolve(2).then(() => {}, () => {}) (which will be resolved with undefined), Promise.resolve(2).finally(() => {}) will be resolved with 2.
>
> Similarly, unlike Promise.reject(3).then(() => {}, () => {}) (which will be fulfilled with undefined), Promise.reject(3).finally(() => {}) will be rejected with 3.
