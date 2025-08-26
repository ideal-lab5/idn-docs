---
sidebar_position: 3
title: Subscription Overview and Cost Model for VRaaS
---

# The VRaaS Credit System

Our Verifiable Randomness-as-a-Service (VRaaS) is a live 'pipe' that **injects** cryptographically secure randomness directly to its target via XCM. To access this service, you must create a subscription on the Ideal Network.

Each subscription is defined with a **frequency** (how often randomness is delivered) and a number of **credits** that power it.

---

### How Credits Work

A **credit** is an abstract unit that represents one block of computation for a subscription. Each active subscription consumes exactly **one credit per block**. When you create a new subscription, you specify an initial number of credits to power it.

The credits are converted to an amount of DOT, which is subject to the latest [pricing tier](#pricing-tiers). You can retrieve these current pricing tiers by querying the runtime. This ensures transparent, real-time pricing and removes the need for manual publication.

This simple model ensures a predictable and transparent cost for your application's access to randomness.

---

### Estimating Costs

Before creating a subscription, you can use the [interactive pricing simulator](../price_simulator.md#vraas-pricing-simulator) to estimate the amount of credits (and corresponding DOT) needed to power your subscription, given a desired frequency and number of pulses.

This tool provides a solid starting point for your cost analysis.

### Getting a Real-Time Quote

#### Pricing Tiers

We provide discounts based on the quantity of credits purchased at any single time using a tiered pricing model. 

**Current Pricing Tiers**
<details>
|tier|discount|
|--|--|
|Tier 1 (1-10_000 credits) | 0% |
|Tier 2 (10_001-100_000 credits) | 5% |
|Tier 3 (101-1000 credits) | 10%  |
|Tier 4 (1001-10000 credits) | 20% |
|Tier 5 (10001+ credits) |30% |
---
</details>

For precise, real-time pricing, you can directly query the Ideal Network runtime. This is the most accurate way to understand your costs before committing to a subscription.

* **Runtime Extrinsic:** If your parachain or smart contract is already integrated, you can call the `request_quote` extrinsic to get a real-time quote, otherwise call the `quote_subscription` extrinsic in the Ideal Network runtime.
* **Explorer UI:** You can also get a quote through the Ideal Network Explorer, which pulls the latest data directly from the runtime.

---

### Creating a Subscription

Subscriptions can be created:
- within parachains who have [integrated the idn-consumer-pallet](../guides_and_tutorials/parachains/runtime_integration/parachain_runtime_integration.md) into their runtime
- by ink! smart contracts that have [integrated the idn-client-contract-lib](../guides_and_tutorials/parachains/smart_contracts/ink.md)



---

### Managing Your Subscription

Once a subscription is created, you can manage its lifecycle through three states:

* **Active:** The subscription is running and consuming 1 credit per block.
* **Paused:** The subscription is temporarily inactive and does not consume credits. This is useful for testing or for dApps with seasonal usage.
* **Terminated:** The subscription has been permanently closed. Remaining credits can be returned to the owner's wallet.

---

### Next Steps

* [Integrate with the Ideal Network](#)
* [Create a Subscription](#)
* [Monitor Your Subscription](#)