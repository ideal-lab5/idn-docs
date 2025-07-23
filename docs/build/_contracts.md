<!-- ---
sidebar_position: 2
---

# Smart Contracts

Learn about using the Ideal Network to use on-chain randomness within ink! smart cotnracts.

Check out the contracts repo [here](https://github.com/ideal-lab5/contracts).

Contracts on the Ideal Network can use both:

- onchain randomness
- delayed transactions for simultaneous protocol completion

## Usage

To use this library, you must be running a node that supports:

- arkworks host functions
- the drand bridge pallet
- ink! smart contracts

You can find an example node [here](https://github.com/ideal-lab5/pallet-drand/tree/main/substrate-node-template).

By incorporating the chain etf chain extension into an ink! smart contract, verifiable randomness generated from the ETF-PFG (or drand bridge pallet) can be used to generate verifiable on-chain randomness:

```
let rand: [u8;32] = self.env()
    .extension()
    .random();
```

### Configuration

To use in a smart contract, at idl-contract-extension to the cargo.toml

``` toml
[dependencies]
idl-contract-extension = { git = "https://github.com/ideal-lab5/contracts.git", default-features = false, features = ["ink-as-dependency"] }

[features]
std = [
    ...
    "idl-contract-extension/std",
]
```

and configure the contract environment to use the DrandEnvironment

``` rust
use idl_contract_extension::ext::DrandEnvironment;
#[ink::contract(env = DrandEnvironment)]
mod your_smart_contract {
    use crate::DrandEnvironment;
    ...
}
``` -->