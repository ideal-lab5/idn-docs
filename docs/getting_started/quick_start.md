---
sidebar_position: 4
title: Quickstart
---
# 🏁 Quickstart

This guide will point you to the tools, libraries, and documentation you need to get started.

---

## The Ideal Network

The IDN blockchain aggregates randomness from Drand Quicknet and delivers it using XCM across chains. The IDN-SDK contains all core functionality of the Ideal Network and code required to itegrate with it.

- [Core Repository (Rust/Substrate)](https://github.com/ideal-lab5/idn-sdk)

---

## 🔎 The IDN Explorer

Use the explorer to manage VRaaS subscription and to view recent randomness pulses.

- [Repository](https://github.com/ideal-lab5/idn-explorer/)
- [Explorer URL](https://idealabs.network)
- Guide TODO

> _📷 add a screenshot here later? embedded video?

---

## ⏳ Timelock Encryption

Use timelock encryption for sealed-bid auctions, commitment schemes, multiplayer games, and more, backed by the Ideal Network. Our library supports multiple language bindings, including Rust, Python, Typescript, and C/C++.

- [Timelock SDK Repo (Rust)](https://github.com/ideal-lab5/timelock)
- [Learn how to integrate timelocked transactions in a dApp](../concepts/timelock_encryption.md)

---

## 🛠 What Should I Do Next?

### For Parachain Developers

Use our lightweight integration to manage VRaas subscription that inject verifiable randomness into your Polkadot/Substrate runtime. Your chain can use this for:

- Leader election
- Verifiable shuffling
- Cross-chain fair games
- Much more

[→ Integration Guide](../integration/parachains/runtime_integration/parachain_runtime_integration.md)

---

### For ink! Smart Contract Developers

You can access fresh randomness **inside ink! smart contracts**, either via:

1. Cross-chain access [via XCM](../integration/parachains/smart_contracts/ink.md)
2. Deploying contracts [directly on the IDN](../integration/ink.md)

---

## 📚 Learn More

Explore the deeper design of the protocol:


- [litepaper-TODO](https://hackmd.io/@Y5vcBYL4SyeRG_CqQq0DoQ/HktrQXI2A)
- [Protocol Design Overview-TODO: migrate to docs](https://hackmd.io/@Y5vcBYL4SyeRG_CqQq0DoQ/HktrQXI2A)

---

Want help? [Join our community chat](https://discord.gg/idealnetwork) or reach out via GitHub Discussions.