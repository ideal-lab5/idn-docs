---
sidebar_position: 3
title: Subscriptions Overview
---

# Subscriptions Overview

To create and manage subscriptions, you must first integrate with the IDN either through:
- a [parachain runtime](./runtime_integration/parachain_runtime_integration.md)
- an [ink! smart contract](./smart_contracts/ink.md)

Once integrated, you can manually create, update, pause, or terminate VRaaS subscriptions [using the idn-consumer-pallet](./runtime_integration/subscription_mgmt.md) for parachains, [the idn-contract-consumer-lib](./smart_contracts/subscription_mgmt.md) for cross-chain ink! smart contracts, or through the [IDN Explorer](#) for a more streamlined experience.

## Subscription Lifecycle

Subscriptions have three lifecycle states:

| **State** | **Description** |
|------------|----------------|
| **Active** | Subscription is running and consuming **1 credit per block**. |
| **Paused** | Temporarily inactive; credits are **not** consumed. Useful for testing or seasonal usage. |
| **Terminated** | Permanently closed; remaining credits can be returned to the owner's wallet. |

## Subscription Pricing

Read the subscription [pricing overview](../../getting_started/subscriptions_and_cost_model.md) or check out the [VRaas pricing simulator](../../price_simulator.md) to get estimates on pricing.
