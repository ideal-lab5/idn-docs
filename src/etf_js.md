# Building apps with etf network

Building with the etf network is made easy through the etf.js library. The library is basically a wrapper around the wasm build of the [etf-sdk](./etf_sdk.md). The library can be used both with a full node or by using the [@ideallabs/smoldot](https://github.com/ideal-lab5/smoldot/tree/etf) lightclient. In addition, it emits an event with incoming block.

See the [etf.js/examples](https://github.com/ideal-lab5/etf.js/tree/main/examples) for a working example on encrypting and decrypting with the sdk.

## Light Client

Smoldot is a wasm-based light client that runs directly in the browser. Our smoldot implementation is a fork of the official one [here](https://github.com/smol-dot/smoldot). Our modifications are purely surroudning the expected headers and ensure they can be SCALE encoded/decoded. For now, in all other ways, everything is exactly the same as the official smoldot.


## Connecting to the Chain

The etf.js library can be run either with a full node or with a light client (in browser). In the future, this could also be done with the extension (work in progress). 

### Full node

Currently we support connecting as a full node on insecure websockets only. This mode can be configured by initializing the library with no flags (or `false`).

``` javascript
let host = '127.0.0.1';
let port = '9944';
const distanceBasedSlotScheduler = new DistanceBasedSlotScheduler();
let api = new Etf(distanceBasedSlotScheduler, host, port);
await api.init();
```

### Light Client

To run with an in-browser light client (smoldot), the library is initalized with:

```javascript
const distanceBasedSlotScheduler = new DistanceBasedSlotScheduler();
let api = new Etf(distanceBasedSlotScheduler);
await api.init(true);
```


### Extension
coming soon


## Slot Scheduler

A `slot schedule` is simply a list of slots that you want to encrypt a message for. For example, a slot schedule could be `[290871100, 290871105, 290871120]`. In general, we can think of the slot schedule as being the `ids` input field to the encrypt function in the `EtfApi`. Along with the AES secret key produced by the `DefaultApiClient`, knowledge of the slot schedule along with the capsule (output from encryption) is enough information to recover the master key.

The slot scheduler interface is used to map some input to a slot schedule

``` javascript
export interface SlotScheduler<T> {
    generateSchedule(n: number, currentSlot: number, input: T): SlotSchedule;
}
```

Additionally, we provide a built-in [DistanceBasedSlotScheduler](todo). Refer to the [example]() for more usage details.

## Encryption and Decryption

Encryption and decryption with etf.js uses the approach detailed [here](./etf_sdk.md#encryption-and-decryption). 

### Encrypt

Messages can be encrypted by passing a number of shares, threshold, and some input to the slot scheduler implementation. In the default EtfClient, encryption uses AES-GCM alongside ETF. It uses TSS to generate key shares, which are encrypted for future slots based on the slot scheduler logic.

``` javascript
let out = api.encrypt(message, 3, 2, new TimeInput(5));
```

The output contains: `aes_out = (AES ciphertext, AES nonce, AES secret key), capsule = (encrypted key shares), slot_schedule`. The `capsule` contains the IBE encrypted key shares and the slot schedule are the slots for which they're encrypted. It assumes the two lists are the same size and follow the same order.

### Decrypt

Once a block has been produced in at least a threshold of the slots in the slot schedule, the AES secret key can be recovered from the decrytpted capsule fragment.

```javascript
let m = await api.decrypt(ciphertext, nonce, capsule, slotSchedule);
let message = String.fromCharCode(...m);
```
