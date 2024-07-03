---
sidebar_position: 2
---

# Smart Contracts

Learn about using the Ideal Network to get on-chain randomness within ink! smart cotnracts.

Check out the contracts repo [here](https://github.com/ideal-lab5/contracts).

Contracts on the Ideal Network can use both:

- onchain randomness
- delayed transactions for simultaneous protocol completion

## Usage

### Onchain Randomness

The chain extension allows contracts to fetch onchain randomness by reading slot secrets from the chain.

```rust
self.env()
    .extension()
    .secret()
```

## Chain Extension and ETF Environment

The Ideal Network uses a custom chain extension to allow smart contracts to check if a slot is in the future or in the past. The chain extension allows you to check if a block has been authored in a given slot, which is very useful in cases where it is important to know if data _can_ be decrypted. The custom environment can be configured in ink! smart contracts to call the chain extension exposed by the Ideal Network runtime.

**ETF Environment setup**

1. Add the dependency to your contract

```toml
[dependencies]
etf-contract-utils = { git = "https://github.com/ideal-lab5/contracts", default-features = false, features = ["ink-as-dependency"] }

[features]
std = [
    "etf-contract-utils/std",
]
```
