---
sidebar_position: 0
title: Choose Your Path
---

## 📜 **Ideal Network Integration Paths**

Welcome to the Ideal Network integration hub. This guide outlines the three primary ways to integrate with our network. Choose the path that best suits your project and development needs.

-----

### ⛓️ **Path 1: Parachain Runtime Integration**

**Who's it for?** Teams building their own **blockchain on Polkadot**.

**What is it?** This is the most powerful and trustless integration. By using our **pallet**, you can bake randomness and timelock logic directly into your runtime. This provides native, on-chain functionality with minimal trust assumptions.

➜ [Go to Parachain Integration Guide](./parachains/runtime_integration/parachain_runtime_integration.md)

-----

### 💻 **Path 2: Smart Contract Integration**

**Who's it for?** Developers building a **dApp on a smart contract parachain** (e.g., Moonbeam or Astar).

**What is it?** This integration uses a simple **XCM call** to request services from the Ideal Network. It's a permissionless, easy-to-use method that lets you build powerful dApps without needing your own runtime.

➜ [Go to cross-chain ink! Smart Contract Integration Guide](./parachains/smart_contracts/ink.md)

-----

### ✍️ **Path 3: Native `ink!` Smart Contract Integration**

**Who's it for?** Developers building a **dApp directly on the Ideal Network**.

**What is it?** The quickest way to use IDN, this integration allows native smart contracts to fetch verifiable randomness at no cost directly from the IDN runtime through a **chain extension**.

➜ [Go to native ink! Smart Contract Integration Guide](./ink.md)

-----

### 🌐 **Path 4: Timelocked Transactions Integration**

**Who's it for?** **Frontend or web developers** building user-facing applications.

**What is it?** The [etf.js](https://github.com/ideal-lab5/etf.js) SDK allows your application to build timelocked transactions directly from the frontend. This is the fastest way to get started and is ideal for web3 games.

➜ [Go to Frontend SDK Guide](./timelocked_txs.md)