---
sidebar_position: 3
title: Subscriptions Overview
---

# Subscriptions Overview

Subscriptions either be managed from the idn-consumer-pallet or else from an ink! smart contract configured     

## Managing Subscriptions

Subscriptions have three lifecycle states:

| **State** | **Description** |
|------------|----------------|
| **Active** | Subscription is running and consuming **1 credit per block**. |
| **Paused** | Temporarily inactive; credits are **not** consumed. Useful for testing or seasonal usage. |
| **Terminated** | Permanently closed; remaining credits can be returned to the owner's wallet. |


