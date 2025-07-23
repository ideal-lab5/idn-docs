---
sidebar_position: 4
title: ...but why another randomness solution?
---

# Comparison to Existing Solutions

| Feature / Property                            | Commit-Reveal | VRF (Chainlink, BABE) | Shutter | Fairblock        | Drand (alone) | IDN               |
| --------------------------------------------- | ------------- | --------------------- | ------- | ---------------- | ------------- | ----------------- |
| **MEV resistance**                            | ❌             | ❌                     | ✅       | ✅                | ❌             | ✅                 |
| **On-chain VRaaS**                            | ❌             | ✅                     | ❌       | ❌                | ❌             | ✅                 |
| **Cryptographic Timelock Support**            | ❌             | ❌                     | ✅ (TSS) | ⚠️ (IBE)          | ✅             | ✅                 |
| **On-chain verifiability**                    | ⚠️             | ✅                     | ❌       | ⚠️ (via relayers) | ✅             | ✅                 |
| **Built-in Cross-Chain Support**              | ❌             | ❌                     | ❌       | ❌                | ❌             | ✅                 |
| **Integration into Polkadot**                 | ✅             | ⚠️ (BABE)              | ❌       | ❌                | ⚠️ (IDN)       | ✅                 |
| **Enables Non-interactive & async Protocols** | ❌             | ✅                     | ❌       | ❌                | ✅             | ✅                 |
| **Requires trusted hardware or setup**        | ❌             | ⚠️ (DKG in Chainlink)  | ⚠️ (DKG) | ⚠️ (DKG)          | ⚠️ (DKG)       | ⚠️ (PoA consensus) |

