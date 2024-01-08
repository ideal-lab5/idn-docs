---
sidebar_position: 3
---

# Delayed Transactions

Delayed transactions use timelock encryption to keep call data encrypted (with timelock encryption) until a specific block in the future.

## Usage

``` javascript
// the call to delay
let innerCall = etf.api.tx.balances
  .transferKeepAlive('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 100);
// calculate a deadline (slot) two blocks from now
let latest = parseInt(latestSlot.slot.replaceAll(",", ""));
let deadline = latest + 2;
// prepare delayed call
let outerCall = etf.delay(innerCall, 127, deadline);
await outerCall.signAndSend(alice, result => {
  if (result.status.isInBlock) {
    console.log('in block')
  }
});
```
## Deep dive

TODO