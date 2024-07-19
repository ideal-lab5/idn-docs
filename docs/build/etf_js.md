# ETF.JS SDK

The **encryption to the future** javascript SDK allows browser-based applications to interact with the [Ideal Network](https://github.com/ideal-lab5/ideal-network), allowing for applications that take advantage of interoperable randomness beacons and timelock encryption.

## Installation

To use the library in your code, the latest published version can be installed from NPM with:

```bash
npm i @ideallabs/etf.js
```

Or, you can build the code with:

```bash
git clone git@github.com:ideal-lab5/etf.js.git
cd etf.js
# ensure typsecript is installed
npm i -g typsecript
# install dependencies
npm i
# build
tsc
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

where you must first fetch the chainspec:

``` bash
wget https://raw.githubusercontent.com/ideal-lab5/etf/main/etfDevSpecRaw.json
```

and import into your codebase:

``` javascript
import chainSpec from './resources/etfTestSpecRaw.json'
```

This will start a smoldot light client in the browser, which will automatically start syncing with the network. With the current setup, this can take a significant amount of time to complete and we will address that soon.

> Warning: smoldot version is currently incompatible with smart contracts.

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

<!-- 
### Delayed Transactions

Delayed transactions can be submitted by  using the `etf.delay` API.

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
>
# API Reference

## `Etf` Class

### `constructor(providerMultiAddr?: string, isProd?: boolean)`

Initializes an instance of the ETF class.

### `init(chainSpec?: string, extraTypes?: any): Promise<void>`

Connects to the chain and initializes the ETF API wrapper.

### `createType(typeName: string, typeData: any): any`

A proxy to the polkadotjs API type registry creation.

### `secrets(blockNumbers: number[]): Promise<Uint8Array[]>`

Fetches secrets from specified blocks.

### `encrypt(messageBytes: Uint8Array, threshold: number, blockNumbers: number[], seed: string): { ciphertext: string, sk: string }`

Encrypts a message for future blocks.

### `decrypt(ct: Uint8Array, nonce: Uint8Array, capsule: Uint8Array, blockNumbers: number[]): Promise<string>`

Decrypts a timelocked ciphertext.

### `delay(rawCall: any, priority: number, deadline: number): { call: any, sk: string, block: number } | Error`

Prepares a secure delayed transaction for a given deadline.

### `listenForSecrets(eventEmitter: EventEmitter): void`

Listens for incoming block headers and emits an event when new headers are encountered.

### `getLatestSlot(): number`

Fetches the latest known slot.

### Fields

#### `public latestBlockNumber: number`

The latest known block number

## License

This project is licensed under the Apache2 License - see the LICENSE file for details.