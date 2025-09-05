---
sidebar_position: 2
title: ink! Smart Contracts on the Ideal Network
---

import styles from '/src/pages/index.module.css';

The Ideal Network support ink! smart contracts that can fetch verifiable randomness directly from the IDN runtime through a chain extension (add link). This makes it free to consume and cheap to verify, allowing developers to easily acquire verifiably random values for their dApps and protocols. While it is the easiest path to get started on the IDN, it is not without limitations, discussed below. 

### How it Works

Ink! smart contracts on the Ideal Network can consume the latest randomness from the runtime **for free** by calling a chain extension that exposes the latest aggregated signature encoded in the IDN runtime. It exposes our implementation of the [Randomness trait](https://paritytech.github.io/polkadot-sdk/master/frame_support/traits/trait.Randomness.html), allowing contracts to get context-bound randomness. Unlike parachain runtimes that must open a subscription, native contracts:
- can only 'pull' randomness, whereas the IDN 'pushes' to parachain runtimes
- usage of the chain extension assumes trust in the values from the runtime, with no further verification (i.e. they do not verify the randomness received).

<div className={styles.linkBtn}>
    <a href="https://github.com/ideal-lab5/idn-sdk/tree/main/contracts/idn-contract-lib/examples/rand-extension-example" target="#">Check out the examples to get started!</a>
</div>

### Integration Guide

1. Add the chain extension to your contract's Cargo.toml

```toml
[dependencies]
idn-contract-lib = { version = "0.1.0", default-features = false }

[features]
default = ["std"]
std = [
    "idn-contract-lib/std",
    # other dependencies with std feature
]
```

2. Configure your contract

```rust
use idn_contract_lib::ext::IDNEnvironment;

#[ink::contract(env = IDNEnvironment)]
pub mod MyContract {
    // make the custom Environment callable
    use crate::IDNEnvironment;
}
```

3. Fetch the latest random value from the runtime

``` rust
#[ink(message)]
pub fn do_something_random(&mut self, subject: [u8; 32]) -> Result<(), RandomReadErr> {
    // Get the on-chain random seed
    let new_random = self.env().extension().fetch_random(subject)?;
    self.value = new_random;
    // do_something(new_random)
    self.env().emit_event(RandomUpdated { new: new_random });
    Ok(())
}
```
