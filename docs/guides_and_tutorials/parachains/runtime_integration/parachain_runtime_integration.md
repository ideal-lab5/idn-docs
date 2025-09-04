---
sidebar_position: 1
title: Parachain Runtime Integration Guide
---

# First Step to Parachain Integration: IDN Consumer Pallet

The **`pallet-idn-consumer`** provides a way for parachains to become a "consumer" of the Ideal Network (IDN). This pallet enables you to subscribe to randomness pulses, request subscription quotes, and manage your subscription state through XCM (Cross-Consensus Message Format).

This guide explains how to integrate the `pallet-idn-consumer` into your parachain's runtime. The core of the integration involves configuring the pallet and its dependencies to allow your parachain to interact with the Ideal Network (IDN) via XCM.

➜ Repository for [pallet-idn-consumer](https://github.com/ideal-lab5/idn-sdk/tree/main/pallets/idn-consumer).

> ⚠️ This library has not yet been published.

## What's next?

After you have integrated the pallet in your runtime, learn about how to [create and manage](./subscription_mgmt.md) subscriptions.

---

## Key Features

* **Subscription Management**: Create, update, pause, reactivate, and terminate subscriptions.
* **Randomness Consumption**: Consume randomness pulses delivered by the IDN.
* **Quote Requests**: Request and consume quotes for subscription fees.
* **Subscription Info**: Retrieve and consume details about your subscriptions.
* **XCM Integration**: Interact seamlessly with the IDN Manager pallet on the Ideal Network.

---

## 📋 Prerequisites
- The Target chain which manages the subscription should be a Sibling chain (share the same Relay Chain with IDN, but not be IDN)
- The Target chain has an RPC node exposed on PolkadotJS
- IDN and the Target chain should have a [bidirectional HRMP channel open](https://substrate.stackexchange.com/questions/5445/how-to-open-hrmp-channels-between-parachains )
- The Sibling chain’s sovereign account on IDN should have enough funds. See:
  - [How to calculate the sovereign account](https://substrate.stackexchange.com/a/1210/3994). TL;DR use [Shawn’s Para ID to account utility](https://www.shawntabrizi.com/substrate-js-utilities/), making sure to select “sibling” in the dropdown
  - [How to get tokens on IDN (Paseo)](../../testnet/faucet.md)

---
## 🛠️ Configuration

You can configure the pallet using the following runtime parameters:

* **`RuntimeEvent`**: The overarching event type for the runtime.
* **`PulseConsumer`**: An implementation of the `PulseConsumer` trait, which defines how to handle incoming randomness pulses.
* **`QuoteConsumer`**: An implementation of the `QuoteConsumer` trait, which defines how to handle incoming subscription quotes.
* **`SubInfoConsumer`**: An implementation of the `SubInfoConsumer` trait, which defines how to handle incoming subscription information.
* **`SiblingIdnLocation`**: The XCM location of the Ideal Network chain.
* **`IdnOrigin`**: The origin type to ensure that XCM calls are genuinely from the IDN.
* **`Xcm`**: The type that provides XCM APIs for cross-chain interactions.
* **`PalletId`**: A unique identifier for this pallet.
* **`ParaId`**: The parachain ID of your consumer chain.
* **`MaxIdnXcmFees`**: The maximum fee (in the IDN asset) to pay for executing a single XCM message sent to the IDN.
* **`WeightInfo`**: Weight functions for benchmarking.

---

### 0. Add the `pallet_idn_consumer` as a Dependency

Add the pallet to your cargo.toml with `default-features = false`:

``` shell
cargo add pallet-idn-consumer
```

> ⚠️ This library has not yet been published. Installation instructions are placeholders.
``` toml
pallet-idn-consumer = { version = "0.0.0", default-features = false }
```


### 1. The `pallet_idn_consumer::Config` Implementation

The first step is to implement the `Config` trait for your runtime. This defines how the pallet interacts with the rest of your parachain.

```rust
impl pallet_idn_consumer::Config for Runtime {
    type RuntimeEvent = RuntimeEvent;
    type PulseConsumer = PulseConsumerImpl;
    type QuoteConsumer = QuoteConsumerImpl;
    type SubInfoConsumer = SubInfoConsumerImpl;
    type SiblingIdnLocation = xcm_config::IdnLocation;
    #[cfg(not(feature = "runtime-benchmarks"))]
    type IdnOrigin = EnsureXcm<frame_support::traits::Equals<xcm_config::IdnLocation>>;
    #[cfg(feature = "runtime-benchmarks")]
    type IdnOrigin = bench_ensure_origin::BenchEnsureOrigin;
    #[cfg(not(feature = "runtime-benchmarks"))]
    type Xcm = PolkadotXcm;
    #[cfg(feature = "runtime-benchmarks")]
    type Xcm = ();
    type PalletId = IdnConsumerPalletId;
    type ParaId = IdnConsumerParaId;
    type MaxIdnXcmFees = MaxIdnXcmFees;
    type WeightInfo = IdnConsumerWeightInfo<Self>;
}
```

-----

### 2. Custom Trait Implementations

The `pallet-idn-consumer` requires three custom trait implementations to define how your parachain processes incoming data from the IDN. You'll need to define the logic for these traits yourself.

  * **`PulseConsumer`**: This trait defines the logic for consuming randomness pulses delivered by the IDN.
  * **`QuoteConsumer`**: This trait handles subscription fee quotes.
  * **`SubInfoConsumer`**: This trait processes subscription information.

**Example Implementation:**

```rust

/// Dummy implementation of the ['PulseConsumer'] trait.
pub struct PulseConsumerImpl;
impl PulseConsumer<Pulse, SubscriptionId, (), ()> for PulseConsumerImpl {
	fn consume_pulse(pulse: Pulse, sub_id: SubscriptionId) -> Result<(), ()> {
		// Randomness consumption logic goes here.
		log::info!("IDN Consumer: Consuming pulse: {:?} with sub id: {:?}", pulse, sub_id);
		Ok(())
	}
}

/// Dummy implementation of the ['QuoteConsumer'] trait.
pub struct QuoteConsumerImpl;
impl QuoteConsumer<Quote, (), ()> for QuoteConsumerImpl {
	fn consume_quote(quote: Quote) -> Result<(), ()> {
		// Quote consumption logic goes here.
		log::info!("IDN Consumer: Consuming quote: {:?}", quote);
		Ok(())
	}
}

/// Dummy implementation of the ['SubInfoConsumer'] trait.
pub struct SubInfoConsumerImpl;
impl SubInfoConsumer<SubInfoResponse, (), ()> for SubInfoConsumerImpl {
	fn consume_sub_info(sub_info: SubInfoResponse) -> Result<(), ()> {
		// Subscription info consumption logic goes here.
		log::info!("IDN Consumer: Consuming subscription info: {:?}", sub_info);
		Ok(())
	}
}
```

➜ Checkout out the [randomness verification](../../rand_verification.md) guide to see how to verify incoming pulses in the PulseConsumerImpl.

-----

### 3. Pallet and Parachain Configuration

The integration requires a few `parameter_types` macros to define constants.

  * **`IdnConsumerParaId`**: Your parachain's ID, fetched automatically from the `ParachainInfo` pallet.
  * **`IdnConsumerPalletId`**: A unique, fixed identifier for the `idn-consumer` pallet.
  * **`MaxIdnXcmFees`**: The maximum amount of fees your parachain is willing to pay in the IDN's native asset for an XCM message. This prevents a single message from consuming too many resources.

<!-- end list -->

```rust
parameter_types! {
    pub IdnConsumerParaId: ParaId = ParachainInfo::parachain_id();
    pub const IdnConsumerPalletId: PalletId = PalletId(*b"idn_cons");
    pub const MaxIdnXcmFees: u128 = 1_000_000_000_000;
}
```

-----

### 4. XCM Configuration

Correct XCM setup is vital for communication with the IDN.

  * **`SiblingIdnLocation`**: This parameter specifies the XCM location of the Ideal Network. You must define `xcm_config::IdnLocation` in your `xcm.rs` file. This tells your parachain where the IDN is located on the relay chain.
  * **`IdnOrigin`**: This parameter is a security measure that ensures incoming messages are from the correct source. It uses `EnsureXcm` to verify the sender's origin matches the defined `IdnLocation`. A separate mock origin is used for benchmarking.
  * **`Xcm`**: This specifies the XCM API your parachain uses. Typically, this will be `PolkadotXcm`, but it's configured to be a placeholder `()` for benchmarking to simplify the process.

<!-- end list -->

```rust
type SiblingIdnLocation = xcm_config::IdnLocation;

#[cfg(not(feature = "runtime-benchmarks"))]
type IdnOrigin = EnsureXcm<frame_support::traits::Equals<xcm_config::IdnLocation>>;

#[cfg(not(feature = "runtime-benchmarks"))]
type Xcm = PolkadotXcm;
```

-----

### 5. Other Runtime Dependencies

Ensure your runtime includes the necessary dependencies, such as `ParachainInfo`, `Balances`, and the XCM-related pallets. The `WeightInfo` is also a standard parameter and should be generated via benchmarking for accurate extrinsic weights.

