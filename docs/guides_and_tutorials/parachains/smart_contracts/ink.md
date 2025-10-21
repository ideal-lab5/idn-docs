---
sidebar_position: 2
title: Cross-Chain ink! Smart Contract Integration
---
 
## IDN Client Library

The `idn-contracts` library provides functionality for interacting with the Ideal Network's IDN Manager pallet through XCM. This allows **contracts on other parachains** to subscribe to and receive randomness from the Ideal Network.

➜ Repository for [idn-contracts](https://github.com/ideal-lab5/idn-sdk/tree/main/contracts).

> ⚠️ This library has not yet been published.

### Features

- Create, pause, reactivate, update, and kill randomness subscriptions
- Receive randomness through XCM callbacks using the Pulse trait
- Store and manage pulse data, including randomness, round numbers, and signatures
- Abstract away the complexity of XCM message construction
- Configurable pallet indices and parachain IDs for different environments

### Prerequisites

To work with ink! smart contracts, you need to have the following tools installed:

1. Rust and Cargo (latest stable version)
2. cargo-contract CLI tool (v5.0.3 or newer)
3. Ensure [bidirectional HRMP channels are open](https://substrate.stackexchange.com/questions/5445/how-to-open-hrmp-channels-between-parachains) between your parachain and the IDN

### Usage

To use the IDN Client library in your contract:

1. Create a new contract `cargo contract new your_contract`

2. Add the `idn-contracts` dependency to your `Cargo.toml`:

```toml
[dependencies]
idn-contracts = { version = "0.1.0", default-features = false }

[features]
default = ["std"]
std = [
    "idn-contracts/std",
    # other dependencies with std feature
]
```

3. Basic Contract Setup

Smart contracts interact with the Ideal Network via the `IdnClient` struct which makes interacting with the network simple. All that's needed by the client is basic information about the IDN and your parachain.

```rust
#[ink::contract]
mod your_contract {

    use idn_contracts::xcm::{types::SubscriptionId, IdnClient};

    #[ink(storage)]
    pub struct YourContract {
        idn_client: IdnClient,
        subscription_id: Option<SubscriptionId>,
    }

    impl YourContract {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                idn_client: IdnClient::new(
                    4502,          // IDN parachain ID
                    40,            // IDN Manager pallet index
                    4594,          // Your parachain ID
                    16,            // Contracts pallet index on your chain
                    6,             // Contract callback call index on your chain
                    1_000_000_000, // Maximum XCM execution fees
                ),
                subscription_id: None,
            }
        }
    }
}
```

4. Implement Randomness Reception

**Within your mod definition**, implement the `IdnConsumer` trait to receive randomness:

```rust
use idn_contracts::xcm::{IdnConsumer, Error, types::{SubscriptionId, Pulse, SubInfoResponse, Quote}};

// Implement the IdnConsumer trait to handle incoming randomness
impl IdnConsumer for YourContract {
    #[ink(message)]
    fn consume_pulse(
        &mut self, 
        pulse: Pulse,
        subscription_id: SubscriptionId
    ) -> Result<(), Error> {
        let randomness = pulse.rand();
        Ok(())
    }

    // Handle subscription quotes
    #[ink(message)]
    fn consume_quote(
        &mut self,
        quote: Quote
    ) -> Result<(), Error> {
        Ok(())
    }

    // Handle subscription information responses
    #[ink(message)]
    fn consume_sub_info(
        &mut self,
        sub_info: SubInfoResponse
    ) -> Result<(), Error> {
        Ok(())
    }
}
```
:::note
When consuming pulses, we provide a way to validate pulses with `is_valid_pulse()` to allow for trustless consumption of randomness pulses.
:::

5. Use the `IdnClient` to manage subscriptions:

The `IdnClient` offers five ways to interact with your subscription. From starting a new subscription, updating your existing subscription, and even killing your subscription, the `IdnClient` has you covered.

```rust
// Request a Quote
self.idn_client.request_quote(
        number_of_pulses, // The total number of pulses you intend to receive
        frequency,        // The number of blocks between pulses
        metadata,         // Optional: Additional metadata about your subscription
        sub_id,           // Optional: subscription id
        req_ref,          // Optional: request reference for tracking requests
        origin_kind,      // Optional: origin kind (default: Native)
)?;

// Create a subscription
self.idn_client.create_subscription(
        credits,      // Total number of initial credits for your subscription
        frequency,    // The number of blocks between pulses
        metadata,     // Optional: Additional metadata about your subscription
        sub_id: None, // Let the system generate an ID
        call_params,  // Optional: Additional call parameters related to gas limits
        origin_kind,  // Optional: origin kind (default: Native)
)?;

// Later request sub information, pause, update, or kill the subscription as needed
self.idn_client.request_sub_info(
        sub_id,      // Your subscription id
        metadata,    // Optional: The metadata of your subscription (required if
                     //           metadata was provided on subscription creation)
        req_ref,     // Optional: request reference for tracking requests
        call_params, // Optional: Additional call parameters related to gas limits
        origin_kind, // Optional: origin kind (default: Native)
)?;

self.idn_client.pause_subscription(sub_id)?;

self.idn_client.update_subscription(
    sub_id,    // Your subscription id
    credits,   // Optional: The new amount of credits for your subscription
    frequency, // Optional: How often you would like to receive pulses
    metadata   // Optional: The metadata of your subscription
)?;
```

## Example Consumer

The example [consumer-contract](https://github.com/ideal-lab5/idn-sdk/tree/main/contracts/examples/consumer-contract) contract demonstrates a complete implementation of a contract that uses the IDN Client library to create a subscription and handle received randomness.

See the [consumer-contract/lib.rs](https://github.com/ideal-lab5/idn-sdk/blob/main/contracts/examples/consumer-contract/lib.rs) file for details on how to:
- Initialize a contract with IDN Client capabilities
- Create and manage randomness subscriptions
- Process received randomness with the Pulse trait
- Store and access pulse history
- Implement proper testing

## Development

### Building Contracts

To build a contract:

```bash
cd contracts/examples/consumer-contract
cargo contract build
```

This will generate the contract artifacts in the `target/ink/<contract-name>` directory:
- `<contract-name>.contract`: The bundled contract (code + metadata)
- `<contract-name>.wasm`: The WebAssembly binary
- `<contract-name>.json`: The contract metadata

### Testing Contracts

To run the unit tests for a contract:

```bash
cargo test
```

To run end-to-end tests (requires a running Substrate node with `pallet-contracts`):

```bash
cargo test --features e2e-tests
```

### Creating a New Contract

To create a new contract:

```bash
cargo contract new <contract-name>
```

Then add the new contract to the workspace members in the root `Cargo.toml` file.

## Contract Structure

Each contract follows this structure:

- `Cargo.toml`: Contract dependencies and configuration
- `lib.rs`: The contract code
- `target/ink/<contract-name>/`: Build artifacts

## ink! Version

These contracts use ink! version 5.1.1 which includes support for XCM operations through the new `xcm_send` and `xcm_execute` functions.
