<!-- ---
sidebar_position: 3
---

# Delayed Transactions

Delayed transactions use timelock encryption to keep call data encrypted (with timelock encryption) until a specific block in the future.

## Usage

``` javascript
// the call to delay
let innerCall = etf.api.tx.balances
  .transferKeepAlive('5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty', 100);
// calculate a deadline (block)
let deadline = etf.latestBlockNumber + 2;
// prepare delayed call  (call, msk)
let outerCall = etf.delay(innerCall, 127, deadline);
await outerCall.call.signAndSend(alice, result => {
  if (result.status.isInBlock) {
    console.log('in block')
  }
});
```
## Deep dive

This is a technical introduction to delayed transactions on the ETF network. For usage of delayed transactions, refer to the [etf.js](../build/etf_js.md) docs.

Delayed transactions works on a per-block basis. That is, it allows for transactions to be delayed for specific future blocks. It uses timelock encryption to seal the call data to ensure it is only unsealable at the specified block. We also introduce the idea of 'timelock commitments'

Let $P = \{P_i\}_{i \in [n]}$ be the participants, where each $P_i$ is a unique wallet. Suppose each of them will submit a delayed transaction for the same future block, $\beta$. Then each participant $P_i \in P$ does the following:

1. Prepare a runtime call $call_i$
2. Encrypt the call data for block $\beta$'s identity: $(ct_i, sk_i) \leftarrow Tlock.Enc(call_i, ID_\beta)$
3. Calculate the "timelock commitment" $c_i = Sha256(call_i || sk_i)$. The secret key $sk_i$ can be stored offchain by $P_i$ if desired for future pre-execution verification.
4. Prepare a call to schedule the encrypted call $tx_i = (ct_i, c_i, \beta)$
5. Sign and send the call to schedule the encrypted call

These transactions are executed in the `on_initialize` hook. When the specified block is initialized:

For a leaked slot secret $sk_\beta$:
1. Recover the call data and encryption key: $(call_i, sk_i) \leftarrow Tlock.Dec(ct_i, sk_\beta)$
2. Verify the timelock commitment by calculating $c_i' = sha256(call_i || sk_i)$ and check that $c_i' == c_i$. If not, then skip to the next ciphertext.
3. If successful, then execute the call. -->
