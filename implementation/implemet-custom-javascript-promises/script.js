const STATE = {
  PENDING: "Pending",
  FULFILLED: "Fulfilled",
  REJECTED: "Rejected",
};

class MyPromise {
  constructor(cb) {
    this.state = STATE.PENDING;
    this.value = undefined;
    this.handlers = [];

    // invoking the callback by passing resolve & reject method
    try {
      cb(this._resolve, this._reject);
    } catch (err) {
      this._reject(err);
    }
  }

  // private methods

  _resolve = (value) => {
    this._updateState(value, STATE.FULFILLED);
  };

  _reject = (error) => {
    this._updateState(error, STATE.REJECTED);
  };

  _updateState = (value, state) => {
    setTimeout(() => {
      /*
        Process the promise if it is still in pending state. 
        An already rejected or resolved promise is not processed
      */
      if (this.state !== STATE.PENDING) return;

      // if the value is also a promise
      if (this._isThenable(value))
        return value.then(this._resolve, this._reject);

      this.value = value;
      this.state = state;

      // execute handlers if already attached
      this._executeHandlers();
    }, 0);
  };

  _isThenable(val) {
    return val instanceof MyPromise;
  }

  _addHandlers(handlers) {
    this.handlers.push(handlers);
    this._executeHandlers();
  }

  _executeHandlers() {
    // Don't execute handlers if promise is not yet fulfilled or rejected
    if (this.state === STATE.PENDING) {
      return null;
    }

    // We have multiple handlers because add them for .finally block too
    this.handlers.forEach((handler) => {
      if (this.state === STATE.FULFILLED) {
        return handler.onSuccess(this.value);
      }
      return handler.onFail(this.value);
    });

    // After processing all handlers, we reset it to empty.
    this.handlers = [];
  }

  // public methods

  then(onSuccess, onFail) {
    return new MyPromise((res, rej) => {
      this._addHandlers({
        onSuccess: function (value) {
          if (!onSuccess) return res(value);

          try {
            return res(onSuccess(value));
          } catch (err) {
            return rej(err);
          }
        },
        onFail: function (value) {
          // if no onFail provided, reject the value for the next promise chain
          if (!onFail) {
            return rej(value);
          }

          try {
            return res(onFail(value));
          } catch (err) {
            return rej(err);
          }
        },
      });
    });
  }

  catch(onFail) {
    return this.then(null, onFail);
  }

  // Finally block returns a promise which fails or succeedes with the previous promise resove value

  finally(cb) {
    return new MyPromise((res, rej) => {
      let val;
      let wasRejected;

      this.then(
        (value) => {
          wasRejected = false;
          val = value;
          return cb();
        },
        (err) => {
          wasRejected = true;
          val = err;
          return cb();
        }
      ).then(() => {
        // If the cb didn't have any error we resolve/reject the promise based on promise state
        if (!wasRejected) {
          return res(val);
        }

        return rej(val);
      });
    });
  }
}

const promise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("HELLO");
  }, 3000);
});

promise.then((res) => console.log(res));
