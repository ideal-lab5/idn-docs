---
sidebar_position: 2
title: Core Capabilities
---

# Core Capabilities

The **Ideal Network (IDN)** provides two core services to developers:  
- **Verifiable Randomness-as-a-Service (VRaaS)**  
- **Timelocked Transactions**

Together, these unlock new functionalities for parachains and smart contracts across the Polkadot ecosystem, allowing for protocols and dApps to:
- receive verifiable random values on-demand
- reason about time across protocols and parachains
- power verifiably fair, automatic on-chain processes
- enable non-interactive and asynchronous multiparty protocols
---

## 1. Key Services

### 🎲 Verifiable Randomness-as-a-Service (VRaaS)

**VRaaS** acts as an **"entropy daemon"** that delivers cryptographically secure randomness to your chain or contract.

#### How It Works
- The IDN manages **subscriptions** for developers.  
- Randomness is **delivered using XCM**, ensuring automated, trustless, and verifiable randomness injection with no manual steps beyond [initial integration](../guides_and_tutorials/quickstart.md).

#### What It Unlocks
With VRaaS, randomness is not only secure but **actionable**, enabling:
- Provably fair games and lotteries
- Verifiable NFT shuffling
- Decentralized leader election
- Autonomous, randomness-driven state changes

#### Integration
- The [idn-sdk](https://github.com/ideal-lab5/idn-sdk) enables parachains to integrate with the IDN's VRaaS:
  - For parachain runtimes, [integrate the idn-consumer pallet](../guides_and_tutorials/parachains/runtime_integration/parachain_runtime_integration.md).
  - For ink! smart contracts (version $\geq 5.1.1$), [integrate the idn-client-consumer-lib](../guides_and_tutorials/parachains/smart_contracts/ink.md).
- Received randomness can be [trustlessly verified on-chain](../guides_and_tutorials/rand_verification.md).

---

### ⏲️ Timelocked Transactions

**Timelocked Transactions** enable cryptographic "encryption to the future," bringing MEV-resistant execution to Web3.

#### How It Works
- IDN leverages the **Drand randomness beacon** to create cryptographic timelocks.  
- Transactions are **encrypted for future execution** without leaking sensitive information ahead of time.

#### What It Unlocks
Timelocks eliminate the need for commit-reveal schemes or trusted intermediaries, enabling:
- MEV-resistant transactions
- Verifiably fair sealed-bid auctions
- Secure, decentralized commitment schemes
- Non-interactive coordination protocols

#### Limitations
The IDN v0's infrastructure limits the number of timelocked transactions per block to `300`.

---

## 2. Core Components

The Ideal Network is powered by **robust, interoperable primitives**:

| Component | Description |
|------------|-------------|
| **Randomness Subscription Management** | Allows external systems (parachains or smart contracts) to subscribe to future randomness. |
| **Offchain Pulse Aggregation** | Network authorities subscribe to Drand’s gossipsub feed, aggregating signatures off-chain for **constant-time** verification. |
| **Onchain Verification & Dispatch** | Aggregated randomness is **trustlessly verified on-chain**, mitigating withholding, forgery, or replay attacks. |
| **Timelock Encryption Mechanism** | Provides asynchronous and non-interactive coordination while protecting against front-running. |
---

## 3. Supporting Technologies

The Ideal Network leverages **Drand** and **Polkadot** for its current architecture.

### Drand

[Drand](https://drand.love/) is a **distributed randomness beacon (DRB)** run by the **League of Entropy**, a consortium of incentivized node operators.

- Uses **threshold BLS signatures** on curve **BLS12-381** with type III pairings.  
- Outputs a **verifiable randomness pulse every 3 seconds**.  
- Each pulse includes:
  - Round number  
  - Signature  
  - Hash of the signature (the "randomness")

For a deep technical overview, see the [Drand Quicknet documentation](https://hackmd.io/@cryptoecon/SyLzsm862).

> **Note:**  
> Drand is currently the backbone of IDN randomness. Future upgrades will replace Drand with our **Silent Threshold Encryption (STE)** protocol, removing reliance on external randomness sources while expanding IDN's capabilities.

---

### Polkadot

Polkadot provides the **ideal environment** for IDN:

- Efficient **on-chain BLS signature verification** (via bilinear pairings).  
- Secure **cross-chain messaging (XCM)** to deliver randomness to any parachain.  
- Shared security and interoperability, ensuring consistent randomness availability.  
- DOT as the native currency, ensuring a fair, universal pricing model across chains.

---

## 4. At a Glance

| Feature | VRaaS | Timelocked Transactions |
|----------|-------|------------------------|
| **Delivery** | XCM-based adapters | Cryptographically timelocked transaction pool |
| **Use Cases** | Games, lotteries, leader election, NFT shuffles | MEV protection, sealed-bid auctions, private coordination |
| **Integration** | SDK + FRAME pallets + contracts | SDK + contract libraries |
| **Trust Model** | Verifiable randomness | Semi-trusted with cryptographic guarantees |

---

## Next Steps
- [Quickstart Integration Guide](../guides_and_tutorials/quickstart.md)  
- [VRaaS Subscription Overview](../getting_started/subscriptions_and_cost_model.md)  
- [Timelocked Transaction Guide](../guides_and_tutorials/timelocked_txs.md)
 