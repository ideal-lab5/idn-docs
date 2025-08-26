---
sidebar_position: 2
title: VRaaS Subscription Management
---

## Overview

The IDN's Verifiable-Randomness-as-a-Service is subscription based, allowing parachains and smart contracts to subscribe to the IDN as a cross-chain 'pipe' that injects verifiable randomness directly into another chain's runtime. Keep reading to understand how subscriptions can be created, updated, paused, or terminated from the idn-consumer pallet.

&rarr; See the [cost model overview](../../../getting_started/subscriptions_and_cost_model.md) to explore pricing.

### Creating a Subscription

To create a subscription, use the `create_subscription` function:

```rust
let sub_id = IdnConsumer::<T>::create_subscription(
    credits,
    frequency,
    metadata,
    sub_id,
)?;
```

**Parameters**

  * `credits`: The number of credits to buy for this subscription. More credits will result in more pulses being received.
  * `frequency`: The pulse distribution interval, specified in block numbers. Pulses are delivered at this frequency.
  * `metadata`: Optional metadata for the subscription (a bounded vector).
  * `sub_id`: An optional subscription ID. If `None`, a new one will be generated automatically.

**Notes**

  * This function immediately starts the subscription in the next IDN block. Randomness will be received via the `consume_pulse` dispatchable.
  * This function uses a "fire and forget" XCM call.

### Managing Subscriptions

#### Pause a Subscription

Use `pause_subscription` to temporarily stop receiving pulses.

```rust
IdnConsumer::<T>::pause_subscription(sub_id)?;
```

**Notes**

  * Pausing a subscription will cause it to skip pulses. Note that skipping pulses still consumes a small number of credits.
  * This is a "fire and forget" XCM call.

#### Reactivate a Paused Subscription

To resume a paused subscription, use `reactivate_subscription`.

```rust
IdnConsumer::<T>::reactivate_subscription(sub_id)?;
```

**Notes**

  * This is a "fire and forget" XCM call.

#### Update a Subscription

To change the subscription's details, use `update_subscription`.

```rust
IdnConsumer::<T>::update_subscription(
    sub_id,
    credits,
    frequency,
    metadata,
)?;
```

**Parameters**

  * `sub_id`: The ID of the subscription you want to update.
  * `credits`: Optional. The new number of credits. Increasing credits may hold more balance, while decreasing them may release some.
  * `frequency`: Optional. The new pulse distribution interval in block numbers.
  * `metadata`: Optional. New metadata (a bounded vector).

Only the fields you provide will be updated.

**Notes**

  * This is a "fire and forget" XCM call.

#### Terminate a Subscription

To permanently end a subscription and remove it, use `kill_subscription`.

```rust
IdnConsumer::<T>::kill_subscription(sub_id)?;
```

**Notes**

  * Terminating a subscription removes it from storage, making it unavailable for future operations.
  * The storage deposit and any remaining held balance will be returned to the user.

-----

### Requesting Quotes and Subscription Info

#### Request a Quote

Use `request_quote` to get a quote for a potential subscription.

```rust
let req_ref = IdnConsumer::<T>::request_quote(
    credits,
    frequency,
    metadata,
    sub_id,
    req_ref,
)?;
```

**Parameters**

  * `credits`: The number of credits to include in the quote.
  * `frequency`: The pulse distribution interval (in IDN block numbers) to include in the quote.
  * `metadata`: Optional metadata to include in the quote.
  * `sub_id`: An optional subscription ID.
  * `req_ref`: An optional request reference to track the request. If `None`, a new one will be generated.

This function sends an XCM call to the IDN parachain. The IDN will process the request and reply with another XCM call to your `consume_quote` dispatchable.

#### Request Subscription Info

To get details about an existing subscription, use `request_sub_info`.

```rust
let req_ref = IdnConsumer::<T>::request_sub_info(sub_id, req_ref)?;
```

**Parameters**

  * `sub_id`: The ID of the subscription to get info for. This is a required field.
  * `req_ref`: An optional request reference to track the request. If `None`, a new one will be generated.

This also sends an XCM call to the IDN parachain, which will reply with a call to your `consume_sub_info` dispatchable.

-----

## Dispatchables

The following functions are used to process data coming *from* the IDN chain. They are filtered by the `IdnOrigin` configuration type to ensure they only accept calls from the IDN.

### `consume_pulse`

Processes a randomness pulse delivered from the IDN chain.

```rust
consume_pulse(origin, pulse, sub_id)
```

**Parameters**

  * `origin`: The origin of the call, which must be from the IDN chain.
  * `pulse`: The randomness pulse to be consumed (Type: `Pulse`).
  * `sub_id`: The subscription ID associated with the pulse (Type: `SubscriptionId`).

The core logic for handling the pulse is defined in your implementation of the `PulseConsumer` trait.

### `consume_quote`

Processes a subscription quote received from the IDN.

```rust
consume_quote(origin, quote)
```

**Parameters**

  * `origin`: The origin of the call, which must be from the IDN chain.
  * `quote`: The subscription quote to be consumed (Type: `Quote`).

The `Quote` object contains:

  * **Fees**: The balance amount that will be held to cover credit consumption.
  * **Deposit**: The storage deposit that will be held and released when the subscription ends.

The logic for handling the quote is defined in your implementation of the `QuoteConsumer` trait.

### `consume_sub_info`

Processes subscription information received from the IDN.

```rust
consume_sub_info(origin, sub_info)
```

**Parameters**

  * `origin`: The origin of the call, which must be from the IDN chain.
  * `sub_info`: The subscription information (Type: `SubInfoResponse`).

The logic for handling this information is defined in your implementation of the `SubInfoConsumer` trait.

-----

## Events

The pallet emits the following events to provide feedback on key actions:

  * `RandomnessConsumed`: A randomness pulse was successfully consumed.
  * `QuoteConsumed`: A subscription quote was successfully consumed.
  * `SubInfoConsumed`: Subscription info was successfully consumed.

-----

## Errors

The pallet may return the following errors:

  * `ConsumePulseError`: Failed to consume a pulse.
  * `ConsumeQuoteError`: Failed to consume a quote.
  * `ConsumeSubInfoError`: Failed to consume subscription info.
  * `PalletIndexConversionError`: Failed to convert the pallet index.
  * `XcmSendError`: Failed to send an XCM message.

-----

## Notes

1.  **Skipping Pulses**: If a `frequency` is set to a value other than `1` or a subscription is paused, pulses will be skipped. Note that skipping a pulse still consumes a small number of credits, though not as many as a delivered pulse.

2.  **Verifying XCM Calls**: Dispatching any of the XCM-based calls (e.g., `create_subscription`, `pause_subscription`, `kill_subscription`) can fail on the IDN parachain even if the function returns `Ok` on your parachain. The best way to verify if a request was processed is to use the `request_sub_info` function.

      * If there is no `sub_id` associated with the request, you can assume it failed if you don't receive a callback to the corresponding consumer dispatchable (e.g., `consume_quote`).
      * For deeper debugging, you can manually inspect the IDN chain's state.

-----
