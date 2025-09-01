---
sidebar_position: 3
title: Verifying Randomness
---

This document details how parachains can efficiently verify that the randomness received is correct based on public parameters. 

> 🚨 The IDN **does not dispatch** pulses that it cannot verify to subscribers. Reverification is not necessary for consumers, however, it does remove a layer of trust.

### Pulse Format

The IDN dispatches 'pulses' of randomness to subscribers. Each pulse is an aggregation of pulses from Drand, spanning one or more rounds of the beacon. Each pulse looks like:

```json
{
    "signature": "0x123ABC...",
    "start": "j",
    "end": "k",
}
```

The signature is an aggregation of the signatures from Drand rounds start through end, and the start and end values correspond to the Drand rounds included in the pulse.

### Verify an Aggregated Pulse (The Hard Way)

To independently verify an aggregated pulse, you can recompute the expected message for the signature. You then verify the signature against this recomputed message using the corresponding public key. The QuicknetVerifier library handles this process for you. 

🔢 For those interested in the underlying cryptographic principles, you can review the [mathematical details](https://hackmd.io/@Y5vcBYL4SyeRG_CqQq0DoQ/HJTsbJ-Nyx).

1. Add the dependencies:

TODO later: versioning
```toml
[dependencies]
sp-idn-crypto = { version = "0.0.0", default-features = false }
sp-idn-traits = { version = "0.0.0", default-features = false }

std = [
    "sp-idn-crypto/std",
    "sp-idn-traits/std"
]

```

2. Import the deps

``` rust
use sp_idn_cryptp::prelude::*;
use sp_idn_traits::pulse::Pulse;
```

3. Reconstruct the expected Drand round number

The message that was signed is an aggregation of the hash (in the G1 elliptic curve group) of the round numbers from each Drand pulse that was aggregated. We need reconstruct that message.

``` rust
// construct the messages and aggregate them
let amsg = (pulse.start()..pulse.end())
    .map(|r| {
        compute_round_on_g1(r).expect("Handle as you please")
    })
    .fold(zero_on_g1(), |amsg, val| (amsg + val).into());
let mut msg_bytes = Vec::new();
amsg.serialize_compressed(&mut msg_bytes).expect("Handle as you please");
```

4. Verify the pulse

Finally, use the `QuicknetVerifier` to check the pulse's signature against the reconstructed message and the beacon's public key

```rust
/// the drand quicknet public key
pub const BEACON_PUBKEY: &[u8] = b"83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a";
// verify the (signature, message) combo against the pubkey
if let Ok(()) = QuicknetVerifier::verify(
    BEACON_PUBKEY.to_vec(),
    pulse.sig().to_vec(),
    msg_bytes,
) {
    // Randomness consumption logic goes here.
    log::info!("IDN Consumer: Verified pulse: {:?} with sub id: {:?}", pulse, sub_id);
} else {
    // This indicates a critical failure in the IDN's integrity or an attack on your network
    // Pause the subscription here.
    log::error!(
        "IDN Consumer: Unverified pulse ingested: {:?} with sub id: {:?}",
        pulse,
        sub_id
    );
}
```

## The Easy Way

The [`RuntimePulse`](#) 'authenticate' function encapsulates the logic above, making it straightforward to authenticate:

```rust
use sp_idn_cryptp::prelude::*;
use sp_idn_traits::pulse::Pulse;

/// the drand quicknet public key
pub const BEACON_PUBKEY: &[u8] = b"83cf0f2896adee7eb8b5f01fcad3912212c437e0073e911fb90022d3e760183c8c4b450b6a0a6c3ac6a5776a2d1064510d1fec758c921cc22b0e17e63aaf4bcb5ed66304de9cf809bd274ca73bab4af5a6e9c76a4bc09e76eae8991ef5ece45a";

/// Dummy implementation of the ['PulseConsumer'] trait with verification logic
pub struct PulseConsumerImpl;
impl PulseConsumer<Pulse, SubscriptionId, (), ()> for PulseConsumerImpl {
    fn consume_pulse(pulse: Pulse, sub_id: SubscriptionId) -> Result<(), ()> {
        if pulse
            .authenticate(BEACON_PUBKEY.try_into().expect("The public key is well-defined; qed."))
        {
            // Randomness consumption logic goes here.
            log::info!("IDN Consumer: Verified pulse: {:?} with sub id: {:?}", pulse, sub_id);
        } else {
            // This should never happen.
            // If it does, you should immediately pause your subscription and contact Ideal Labs.
            log::error!(
                "IDN Consumer: Unverified pulse ingested: {:?} with sub id: {:?}",
                pulse,
                sub_id
            );
        }

        Ok(())
    }
}
```
