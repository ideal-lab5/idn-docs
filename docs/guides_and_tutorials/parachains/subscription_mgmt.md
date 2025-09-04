---
sidebar_position: 3
title: Subscriptions Overview
---

# Subscriptions Overview

To create anad manage subscriptions, you must first integrate with the IDN either through a [parachain runtime](./runtime_integration/parachain_runtime_integration.md) or [ink! smart contract](./smart_contracts/ink.md).
Once integrated, you can manually create, update, pause, or terminate VRaaS subscriptions [using the idn-consumer-pallet](#) for parachains, [the idn-contract-consumer-lib](#) for cross-chain ink! smart contracts, or through the [IDN Explorer](#) for a more streamlined experience.

## Subscription Lifecycle

Subscriptions have three lifecycle states:

| **State** | **Description** |
|------------|----------------|
| **Active** | Subscription is running and consuming **1 credit per block**. |
| **Paused** | Temporarily inactive; credits are **not** consumed. Useful for testing or seasonal usage. |
| **Terminated** | Permanently closed; remaining credits can be returned to the owner's wallet. |


## Managing Subscriptions


