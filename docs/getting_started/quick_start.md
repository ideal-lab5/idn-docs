---
sidebar_position: 1
title: Quickstart
---
import styles from '/src/pages/index.module.css';

# Start Building with the Ideal Network

This guide provides a conceptual overview and technical preview of the Ideal Network's core capabilities, setting the stage for your specific integration. The Ideal Network's native **timelock encryption** enables transactions to be verifiably locked for a future date, providing true MEV resistance and fair coordination. Its **verifiable randomness** provides a secure source of on-chain unpredictability.

---

### Code Preview: What Ideal Network Integration Looks Like

Our APIs are designed to be elegant and straightforward, regardless of your integration method. These code examples are for illustrative purposes to show you what your final integration might look like. For a detailed guide, select your path below.

#### **1. Parachain Runtime Developers**
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
````
<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/parachains/runtime_integration/parachain_runtime_integration">Start Your Parachain Integration</a>
</div>

-----

#### **2. Smart Contract Developers**

**Best for dApp developers on smart contract parachains or on the IDN itself.**
You can call Ideal Network services using cross-chain messaging (XCM) on smart contract parachains, or directly on the IDN without needing a VRaaS subscription.

```rust
use idn_client_contract_lib::{
    ContractPulse, IdnClient, IdnClientImpl, RandomnessReceiver, 
    SubscriptionId, Result, Error
};
use idn_client_contract_lib::Pulse;

// Implement the RandomnessReceiver trait to handle incoming randomness
impl RandomnessReceiver for YourContract {
    fn on_randomness_received(
        &mut self, 
        pulse: ContractPulse,
        subscription_id: SubscriptionId
    ) -> Result<()> {
        // Access the raw randomness
        let randomness = pulse.rand();
        
        // Optionally, store the full pulse for verification purposes
        // self.last_pulse = Some(pulse);
        
        // Handle the received randomness
        Ok(())
    }
}
```

<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/parachains/smart_contracts/ink">Start Your ink! Smart Contract Integration</a>
</div>

---

#### **3. ink! Smart Contracts on the Ideal Network**

The Ideal Network support ink! smart contracts that can fetch verifiable randomness directly from the IDN runtime through a chain extension (add link). This makes it free to consume 
and cheap to verify, allowing developers to easily acquire verifiably random values for the dApps and protocols.

```rust
// TODO: this isn't correct
use idn_client_contract_lib::{
    ContractPulse, IdnClient, IdnClientImpl, RandomnessReceiver, 
    SubscriptionId, Result, Error
};
use idn_client_contract_lib::Pulse;

// Implement the RandomnessReceiver trait to handle incoming randomness
impl RandomnessReceiver for YourContract {
    fn on_randomness_received(
        &mut self, 
        pulse: ContractPulse,
        subscription_id: SubscriptionId
    ) -> Result<()> {
        // Access the raw randomness
        let randomness = pulse.rand();
        
        // Optionally, store the full pulse for verification purposes
        // self.last_pulse = Some(pulse);
        
        // Handle the received randomness
        Ok(())
    }
}
```

<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/parachains/smart_contracts/ink">Use randomness in ink! Smart Contracts on the IDN</a>
</div>


---

#### **4. Frontend Developers**

**Best for web developers who want to easily interact with the network's timelock capabilities.**
Our SDK provides a clean interface for interacting with our network's capabilities from a web application. This is the fastest way to get started.

```javascript
import { createTimelockedTx } from '@ideallabs/sdk';
import { transaction } from 'polkadot-wallet';

async function lockMyTransaction() {
    // Create a transaction you want to lock
    const tx = transaction.transfer('5G8bN...').withValue(100);

    // Use our SDK to wrap the transaction with a timelock, set for 24 hours
    const timelockedTx = createTimelockedTx(tx, { lockDuration: '24h' });

    // Send the timelocked transaction to the network
    await timelockedTx.send();
}
```

<div className={styles.linkBtn}>
    <a href="../guides_and_tutorials/ink">Securely lock and schedule MEV resistant transactions</a>
</div>

-----

### What's Next?

Now that you've seen what's possible, choose your development path to find detailed setup instructions and examples.

  * **For Parachain Developers:** [Go to the Parachain Integration Guide]
  * **For Smart Contract Developers:** [Go to the Smart Contract Guide]
  * **For Frontend Developers:** [Go to the Frontend SDK Guide]





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