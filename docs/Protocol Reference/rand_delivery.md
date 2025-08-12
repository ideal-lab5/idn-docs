---
sidebar_position: 1
title: Randomness Distribution Model
---

## Randomness Distribution

The Pallet IDN Manager distributes randomness in the form of pulses to target parachains and smart contracts via XCM. The pallet coordinates this process through a subscription-based model where targets specify how they wish to receive randomness. Each pulse contains verifiable randomness along with its corresponding round number, delivered according to subscription parameters.

In addition to injecting aggregated signatures into the runtime, each authority is responsible for *querying active subscriptions* with each block. In general, the greater the *total number of active subscriptions*, the greater *potential max queries* that must be made by any given collator within a block. 

### Subscription Layer
The subscription layer implements a management system for randomness distribution. Subscriptions exist in one of two states: Active or Paused.

``` mermaid
stateDiagram
    [*] --> Active
    Active--> Paused
    Paused--> Active
    Active --> [*]
    Paused --> [*]
```

Each subscription contains:

- `Target`: XCM multilocation where randomness will be delivered
- `Call Index`: Identifier specifying the pallet and function to receive the randomness
- `Credits`: Quantity of random values to be delivered before subscription termination
- `Frequency`: Block interval between randomness deliveries
- `Pulse Filter`: Optional conditions to selectively process pulses (e.g., only specific rounds)

The layer exposes the following API:

- `create_subscription`: Establishes a new subscription with the specified parameters
- `update_subscription`: Modifies an existing subscription's credits, frequency, or filtering criteria
- `pause_subscription`: Temporarily halts randomness distribution
- `reactivate_subscription`: Resumes a previously paused subscription
- `kill_subscription`: Terminates a subscription and refunds remaining credits

Subscriptions have built-in economic guarantees through a fee and deposit system. A storage deposit is held for the duration of the subscription and returned upon termination. Fees are calculated based on credits required.


### Randomness Delivery Layer
When the Randomness Beacon pallet verifies and commits a new pulse, the Delivery Layer processes it against active subscriptions using the following procedure:

1. **Eligibility Determination:** For each active subscription, the system:
    - Verifies the subscription has sufficient credits
    - Checks if the frequency condition is satisfied (block spacing)
    - Applies any pulse filters (e.g., specific round numbers)
2. **XCM Message Construction:** For eligible subscriptions, an XCM message is constructed containing:
    - The pulse data (randomness and round number)
    - Target parameters specified in the subscription
3. **Message Dispatch:** The XCM message is sent to the target with the specified call index
4. **Credit Accounting:** Upon successful delivery:
    - One credit is consumed per delivery
    - The subscription's last_delivered timestamp is updated
    - The subscription is automatically terminated when credits reach zero
