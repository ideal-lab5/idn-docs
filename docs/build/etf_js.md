# ETF.JS SDK

The **encryption to the future** javascript SDK allows browser-based applications to interact with the [Ideal Network](https://github.com/ideal-lab5/ideal-network), allowing for applications that take advantage of interoperable randomness beacons and timelock encryption.

## Installation

The library can be installed within a javascript project with npm:

``` shell
npm i @ideallabs/etf.js
```

## Usage

The etf.js library can be run either with a full node or with a light client (in browser).

### Connecting to a node

``` javascript
import { Etf } from '@ideallabs/etf.js'
```

#### Full node

To connect to a full node, pass the address of the node's rpc to the init function.

```javascript
let ws = 'ws://localhost:9944';
let etf = new Etf(ws)
await etf.init()
```

Note: You can connect to the test network by specifying `ws = 'wss://etf1.idealabs.network:443'`

#### Smoldot

To run with an in-browser light client (smoldot), the library is initalized with:

```javascript
let etf = new Etf()
await etf.init(chainSpec)
```

where you must first fetch the chainspec (FOR EXAMPLE):

``` bash
wget https://raw.githubusercontent.com/ideal-lab5/etf/main/etfDevSpecRaw.json
```

and import into your codebase:

``` javascript
import chainSpec from './resources/etfTestSpecRaw.json'
```

This will start a smoldot light client in the browser, which will automatically start syncing with the network. With the current setup, this can take a significant amount of time to complete.

#### Types

The API has an optional `types` parameter, which is a proxy to the polkadotjs types registry, allowing you to register custom types if desired.

``` javascript
// create custom types
const CustomTypes = {
    TlockMessage: {
      ciphertext: 'Vec<u8>',
      nonce: 'Vec<u8>',
      capsule: 'Vec<u8>',
      commitment: 'Vec<u8>',
    },
  };
await api.init(chainSpec, CustomTypes)
```

### Using Randomness

The library allows verifiable randomness from the IDN to be easily used within web applications. There are several ways that the output can be consumed, which can vary based on use case.

#### RPC Subscription

The simplest method is to subscribe to the justifications streamed from the IDN:

``` js
const unsubscribe = await etf.subsribeBeacon((rand) => {
  // verify the pulse of randomness
  if !etf.verify(rand) {
    console.error("An invalid pulse was encountered.");
    unsubscribe();
  }

  doThing(rand);

}); 
```

#### Runtime Query

If randomenss at a specific block is required, the runtime can be queried instead. The randomness output from this query could be empty if there was no pulse recorded for that block. 

``` js
// get randomness at a block b
let rand = await etf.getPulse(b, (rand) => {
  
});
```

### Timelock Encryption

<!-- See the [react-tlock](./examples/react-tlock/) example. -->

#### Encryption

Messages can be encrypted by passing a number of shares, threshold, and a list of future block numbers. In the default EtfClient, encryption uses AES-GCM alongside ETF. It uses TSS to generate key shares, which are encrypted for blocks.

```javascript
// a number to encrypt
let message = "encrypt me!"
// a future block number
let blockNumber = 100;
// a (secret) seed to use to generate a unique secret key
// using the same seed with different block numbers results in new keys 
let seed = "random-seed"
let ciphertext = etf.encrypt(message, blockNumber, seed)
```

#### Decryption

Decryption first requires that you obtain a valid BLS signature, which is produced by the Ideal Network on top of each block it finalizes.

```javascript
let m = await etf.decrypt(ciphertext, nonce, capsule, blockNumbers)
let message = String.fromCharCode(...m)
```


### Shielded Transactions

Shielding a transaction with timelock encryption enables private transaction scheduling. Shielded transactions can be submitted by  using the `etf.delay` API.

<!-- See the [react-delayed-txs](./examples/react-delayed-txs//) example. -->

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

## License

This project is licensed under the MIT License - see the LICENSE file for details.