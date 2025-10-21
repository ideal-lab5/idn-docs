---
sidebar_position: 1
title: Quickstart
---
import styles from '/src/pages/index.module.css';

# Start Building with the Ideal Network

This guide provides a conceptual overview and technical preview of the Ideal Network's core capabilities, setting the stage for your specific integration. The Ideal Network's native **timelock encryption** enables transactions to be verifiably locked for a future date, providing true MEV resistance and fair coordination. Its **verifiable randomness** provides a secure source of on-chain unpredictability.

---

## Integrate with VRaaS

Our APIs are designed to be elegant and straightforward, regardless of your integration method. These code examples are for illustrative purposes to show you what your final integration might look like. For a detailed guide, select your path below.

### **For Parachain Runtime Developers**

**Best for teams building core runtime features requiring verifiable on-chain randomness.**

Integrate our services directly into your blockchain's runtime using our Substrate pallet. This gives you the most control and a direct line to our core functionalities.

```rust
pub struct PulseConsumerImpl;
impl PulseConsumer<Pulse, SubscriptionId, (), ()> for PulseConsumerImpl {
    fn consume_pulse(pulse: Pulse, sub_id: SubscriptionId) -> Result<(), ()> {
        // Randomness consumption logic goes here.
        log::info!("IDN Consumer: Consuming pulse: {:?} with sub id: {:?}", pulse, sub_id);
        Ok(())
    }
}
```
<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/parachains/runtime_integration/parachain_runtime_integration">Start Your Parachain Integration</a>
</div>

-----

### **For Cross-Chain ink! Smart Contracts**

**Best for dApp developers on smart contract parachains**

You can call Ideal Network services using cross-chain messaging (XCM) on smart contract parachains without the hassle of XCM message creation.

1. Add the idn-contracts library as a dependency
    ``` toml
    [dependencies]
    idn-contracts = { version = "0.1.0", default-features = false }
    
    [features]
    default = ["std"]
    std = [
        "idn-contracts/std",
        # other dependencies with std feature
    ]
    ```

2. Implement the `IdnConsumer` trait

    ```rust
    use idn_contracts::xcm::{IdnConsumer, Error, types::{SubscriptionId, Pulse, SubInfoResponse, Quote}};
    
    impl IdnConsumer for YourContract {
        #[ink(message)]
        fn consume_pulse(
            &mut self, 
            pulse: Pulse,
            subscription_id: SubscriptionId
        ) -> Result<(), Error> {
            Ok(())
        }
    
        #[ink(message)]
        fn consume_quote(
            &mut self,
            quote: Quote
        ) -> Result<(), Error> {
            Ok(())
        }
    
        #[ink(message)]
        fn consume_sub_info(
            &mut self,
            sub_info: SubInfoResponse
        ) -> Result<(), Error> {
            Ok(())
        }
    }
    ```

3. Consume randomness
    ```rust
    let randomness = pulse.rand();
    ```
  
Check our smart contracts for parachains page for more details:

<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/parachains/smart_contracts/ink">Open a VRaaS Pipe from your contract</a>
</div>

---

### **For native ink! Smart Contracts on the Ideal Network**

The Ideal Network supports ink! smart contracts that can fetch verifiable randomness directly from the IDN runtime through a [chain extension](https://github.com/ideal-lab5/idn-sdk/tree/main/contracts/src/ext). This makes it free to consume and cheap to verify, allowing developers to easily acquire verifiably random values for their dApps and protocols.

Check out the [example](https://github.com/ideal-lab5/idn-sdk/tree/main/contracts/examples/rand-extension) to get started!

1. Add the `idn-contracts` library to your contract's Cargo.toml

    ```toml
    [dependencies]
    idn-contracts = { version = "0.1.0", default-features = false }
    
    [features]
    default = ["std"]
    std = [
        "idn-contracts",
        # other dependencies with std feature
    ]
    ```

2. Configure your contract

    ```rust
    use idn_contracts::ext::IDNEnvironment;
    
    #[ink::contract(env = IDNEnvironment)]
    pub mod MyContract {
        // make the custom Environment callable
        use crate::IDNEnvironment;
    }
    ```

3. Fetch the latest random value from the runtime

    ``` rust
    let random = self.env().extension().random();
    ```
    
<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/ink">Use randomness in ink! Smart Contracts on the IDN</a>
</div>

---

### **For Frontend Developers Sending Timelocked Transactions**

**Best for web developers who want to easily interact with the network's timelock capabilities.**
Our SDK provides a clean interface for interacting with our network's capabilities from a web application. The fastest way to get started is through the [etf.js](https://github.com/ideal-lab5/etf.js) library. To get start, install the latest version:

``` shell
# with yarn
yard add @ideallabs/etf.js
# or npm
npm i @ideallabs/etf.js
```

The library can be used to build timelocked transactions that can be submitted to the Ideal Network's encrypted transaction pool.

``` js
// Schedule for round number 123123123123
const executionRound = 123123123123
// Encrypt the transaction with a secret seed.
let secretSeed = new TextEncoder().encode('my-secret-seed')
const delayedTx = await etf.delay(innerCall, executionRound, secretSeed)
// zeroize your seed!
secretSeed.fill(0)
// Sign and submit the delayed transaction (using @polkadotjs/api)
await delayedTx.signAndSend(alice, (result) => {
  if (result.status.isInBlock) {
    console.log(`Delayed transaction submitted in block ${result.status.asInBlock}`);
  }
});
```

<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/timelocked_txs">Send MEV-resistant timelocked transactions with the IDN</a>
</div>

-----

## What's Next?

Now that you've seen what's possible, choose your development path to find detailed setup instructions and examples.

  * **For Parachain Developers:** [Go to the Parachain Integration Guide](../guides_and_tutorials/parachains/runtime_integration/parachain_runtime_integration.md)
  * **For ink! Smart Contract Developers:**
    * [Learn how to create a VRaaS from a contract](../guides_and_tutorials/parachains/smart_contracts/ink.md)
    * [Deploy contracts on the IDN to get randomness for free](../guides_and_tutorials/ink.md)
  * **For Frontend Developers:** [Go to the Timelocked Transactions Guide](../guides_and_tutorials/timelocked_txs.md)





<!-- This guide will point you to the tools, libraries, and documentation you need to get started.

---

## The Ideal Network

The IDN blockchain aggregates randomness from Drand Quicknet and delivers it using XCM across chains. The IDN-SDK contains all core functionality of the Ideal Network and code required to itegrate with it.

- [Core Repository (Rust/Substrate)](https://github.com/ideal-lab5/idn-sdk)

---

## 🔎 The IDN Explorer

Use the explorer to manage VRaaS subscription and to view recent randomness pulses.

- [Repository](https://github.com/ideal-lab5/idn-explorer/)
- [Explorer URL](https://idealabs.network)
- Guide TODO

> _📷 add a screenshot here later? embedded video?

---

## ⏳ Timelock Encryption

Use timelock encryption for sealed-bid auctions, commitment schemes, multiplayer games, and more, backed by the Ideal Network. Our library supports multiple language bindings, including Rust, Python, Typescript, and C/C++.

- [Timelock SDK Repo (Rust)](https://github.com/ideal-lab5/timelock)
- [Learn how to integrate timelocked transactions in a dApp](../concepts/timelock_encryption.md)

---

## 🛠 What Should I Do Next?

### For Parachain Developers

Use our lightweight integration to manage VRaas subscription that inject verifiable randomness into your Polkadot/Substrate runtime. Your chain can use this for:

- Leader election
- Verifiable shuffling
- Cross-chain fair games
- Much more

[→ Integration Guide](../integration/parachains/runtime_integration/parachain_runtime_integration.md)

---

### For ink! Smart Contract Developers

You can access fresh randomness **inside ink! smart contracts**, either via:

1. Cross-chain access [via XCM](../integration/parachains/smart_contracts/ink.md)
2. Deploying contracts [directly on the IDN](../integration/ink.md)

---

## 📚 Learn More

Explore the deeper design of the protocol:


- [litepaper-TODO](https://hackmd.io/@Y5vcBYL4SyeRG_CqQq0DoQ/HktrQXI2A)
- [Protocol Design Overview-TODO: migrate to docs](https://hackmd.io/@Y5vcBYL4SyeRG_CqQq0DoQ/HktrQXI2A)

---

Want help? [Join our community chat](https://discord.gg/idealnetwork) or reach out via GitHub Discussions. -->

<!-- ---
sidebar_position: 1
title: Quickstart
--- -->