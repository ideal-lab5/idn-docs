---
sidebar_position: 3
title: Subscription Overview and Cost Model for VRaaS
---

# The VRaaS Credit System

**Verifiable Randomness-as-a-Service (VRaaS)** provides a live pipe that **injects cryptographically verifiable randomness** directly to a target location using [cross-consensus messaging](https://docs.polkadot.com/develop/interoperability/intro-to-xcm/) (XCM).

**To start using VRaaS:**
1. [Integrate with the Ideal Network](../guides_and_tutorials/quickstart.md)
2. [Create a subscription](../guides_and_tutorials/parachains/subscription_mgmt.md) powered by *credits*.

Each subscription is defined by:
- **Frequency** – how often randomness is delivered (i.e. the number of blocks between pulses, where you do not receive a pulse)
- **Credits** – an abstract "token" that powers the subscription.  

---

## How Credits Work

A **credit** represents one block of computation for a subscription:  
- Each active subscription **consumes 1 credit per block**.  
- When creating a subscription, you set the **initial number of credits** to fund it.  

The DOT cost of credits is based on the current [pricing tier](#pricing-tiers).
<!-- TODO -->
<!-- which can be **queried in real time** from the runtime.   -->
This ensures **predictable and transparent pricing** without manual updates.

---

## Estimating Costs

Before creating a subscription, use the [interactive pricing simulator](../price_simulator.md#vraas-pricing-simulator) to estimate:  
- How many credits you’ll need (based on frequency and pulses).  
- The corresponding DOT required.

> **Tip:** Use the simulator for quick planning, then confirm exact costs by querying the runtime for real-time data.

---

## Getting a Real-Time Quote

### Pricing Tiers

VRaaS uses a **tiered pricing model** with discounts for bulk credit purchases.

| **Tier** | **Credits Purchased**       | **Discount** |
|-----------|----------------------------|--------------|
| Tier 1    | 1 – 10,000                 | 0%           |
| Tier 2    | 10,001 – 100,000           | 5%           |
| Tier 3    | 101,000 – 1,000,000        | 10%          |
| Tier 4    | 1,001,000 – 10,000,000     | 20%          |
| Tier 5    | 10,000,001+                | 30%          |

---

### How to Request a Quote

There are three ways to retrieve a **real-time quote** from the Ideal Network:

- **From a parachain runtime**  
  Use the [`idn-consumer-pallet`](../guides_and_tutorials/parachains/runtime_integration/subscription_mgmt.md#request-a-quote) extrinsic.
  
- **From an ink! smart contract**  
  Use the [`idn-client-contract-lib`](../guides_and_tutorials/parachains/smart_contracts/subscription_mgmt.md).

- **Directly from the IDN runtime**  
  Call the `quote_subscription` extrinsic manually.

- **From the Explorer UI**  
  Use the [Ideal Network Explorer](https://app.idealabs.network) to get up-to-date quotes without coding.

---

## Subscription Creation and Management

You can create and manage subscriptions through any of the following methods:

- **From a parachain runtime**  
  Integrated with the [`idn-consumer-pallet`](../guides_and_tutorials/parachains/runtime_integration/subscription_mgmt.md#creating-a-subscription).

- **From an ink! smart contract**  
  Using the [`idn-client-contract-lib`](../guides_and_tutorials/parachains/smart_contracts/subscription_mgmt.md).

- **From the Explorer UI**  
  [Launch the app](https://app.idealabs.network) and manage subscriptions visually.

---

## Next Steps

- [Integrate with the Ideal Network](../guides_and_tutorials/quickstart.md)
- [Create Your First Subscription](../guides_and_tutorials/parachains/runtime_integration/subscription_mgmt.md)
- [Monitor Your Subscription on the Explorer - TODO](#)
