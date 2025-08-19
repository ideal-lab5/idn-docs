---
sidebar_position: 3
title: Integrate with the IDN
---
---

## **Introduction**

Welcome to the Ideal Network integration hub. This guide will help you understand the three primary ways to integrate with our network. Choose the path that best suits your project and development needs.

---

## **Choose Your Path**

### **Path 1: Parachain Runtime Integration**
* **Who it's for:** A team building their own blockchain on Polkadot.
* **What it is:** This is the most powerful and trustless integration. You'll use our pallet to bake randomness and timelock logic directly into your runtime. This provides native, on-chain functionality with minimal trust assumptions.
* **[Go to the Parachain Integration Guide](../guides_and_tutorials/parachains/runtime_integration/parachain_runtime_integration.md)**

### **Path 2: Smart Contract Integration**
* **Who it's for:** A developer building a dApp on a smart contract parachain like Moonbeam or Astar.
* **What it is:** This integration uses a simple `XCM` call to request services from the Ideal Network. It's permissionless, easy to use, and allows you to build powerful dApps without needing your own runtime.
* **[Go to Smart Contract Integration Guide]**

### **Path 3: Native ink! Smart Contract Integration**
* **Who it's for:** A developer building a dApp on the Ideal Network.
* **What it is:** The quickest way to use the IDN, this integration let's native smart contracts fetch verifiable randomness at no cost directly from the IDN runtime through a chain extension.
* **[Go to Smart Contract Integration Guide]**

### **Path 4: Frontend SDK Integration**
* **Who it's for:** A frontend or web developer building a user-facing application.
* **What it is:** Our SDK allows your application to handle timelocked transactions and randomness requests directly from the frontend. This is the fastest way to get started and is ideal for games or web apps.
* **[Go to Frontend SDK Guide]**