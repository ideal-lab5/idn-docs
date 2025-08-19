---
sidebar_position: 2
title: Core Capabilities
---

The Ideal Network (IDN) is a cryptographic coordination layer designed to bring verifiable randomness, timelock encryption, and fair coordination protocols to decentralized systems, starting with the Polkadot ecosystem.

We're starting with a powerful randomness oracle, but our long-term vision is to support practical witness encryption and scalable, privacy-preserving threshold encryption.

---

### Key Services

The Ideal Network is built to offer two primary services to developers: **VRaaS** and **Timelock Encryption**.

#### 🎲 Verifiable Randomness-as-a-Service (VRaaS)

VRaaS is a subscription-based 'entropy daemon' for parachains and smart contracts.

* **How it Works:** The IDN manages subscriptions and dispatches provably fair randomness to subscribers using XCM-based adapters. This enables a fine-grained, automated, trustless, and on-chain randomness solution without manual intervention.
* **What it unlocks:** This gives developers randomness that is not just usable but **actionable**. Subscribed randomness can trigger smart contract logic, gate access to critical operations, or drive state changes, enabling:
    * Provably fair games and lotteries
    * Verifiable shuffling for NFT drops
    * Decentralized leader election
    * Randomness-based governance
* **Integration:** We offer an SDK and XCM adapter library to simplify integration for both FRAME pallets and smart contracts. Delivery via XCM is trustless and executed on the destination using standard cross-chain proof validation, with no trust assumptions beyond finality.

* _**[Diagram of VRaaS flow here]**_

---

#### ⏲️ Timelock Encryption

The Ideal Network brings cryptographic timelock capabilities to the ecosystem, manifested as a native MEV-resistant transaction pool.

* **How it Works:** By bridging the Drand randomness beacon, we enable a form of "encryption to the future." Transactions can be encrypted for future execution without leaking information in advance.
* **What it unlocks:** These cryptographic timelocks eliminate the need for commit-reveal schemes or trusted intermediaries, enabling:
    * MEV-resistant transactions
    * Verifiably fair sealed-bid auctions
    * Decentralized commitment schemes
    * Secure, non-interactive coordination in a decentralized way

---

### Core Components

The Ideal Network is powered by a set of robust, interoperable primitives.

* **Randomness Subscription Management:** Allows external systems (parachains and smart contracts) to subscribe to future randomness.
* **Offchain Pulse Aggregation:** Our network authorities consume pulses from Drand through a gossipsub topic, aggregating signatures off-chain for constant-time verification.
* **Onchain Verification:** Aggregated signatures are trustlessly and efficiently verified on-chain. This system is designed to mitigate withholding, forgery, and replay attacks.
* **Timelock Encrypted Transactions Mechanism:** A core feature that supports asynchronous and non-interactive coordination.

> **Note:** For a deep technical breakdown of these components, see the **How it Works** page in the **Concepts & Technologies** section.

<!-- 
The Ideal Network (IDN) is designed as a cryptographic coordination layer for decentralized systems, starting with the Polkadot ecosystem. It enables verifiable randomness, timelock encryption, and fair coordination protocols, all powered by interoperable cryptographic primitives.

While the initial version of IDN functions as a randomness oracle bridging Drand’s Quicknet to Polkadot, this is only the beginning. Our long-term vision is to support practical witness encryption and scalable, privacy-preserving threshold encryption networks, overcoming the limitations of existing MPC networks.

<p align="center">
  <img src="/img/overview.png" width="500"/>
</p>

<br></br>

<div style={{
  border: '1px solid #ccc',
  padding: '10px',
  borderRadius: '4px'
}}>
    <span>
        <span style={{fontSize: '25px'}}>📄</span> For a detailed technical breakdown of the IDN v0 architecture, see:
    https://hackmd.io/@Y5vcBYL4SyeRG_CqQq0DoQ/HktrQXI2A
    </span>
</div>

## Core Components

- **Randomness Subscription Management**: Allows external systems (like parachains and smart contracts) to subscribe to guaranteed future randomness.
- **Offchain Pulse Ingestion and Aggregation**: Network authorities (collators) consume pulses from Drand through a gossipsub topic maintained by the League of Entropy. Rather than verifying every pulse on-chain (which can be expensive), collators aggregate signatures off-chain, ensuring constant time verification on-chain.
- **Onchain Randomness Verification and Dispatch**: Aggregated signatures are trustlessly and efficiently verified on-chain. The system is careful to mitigate withholding, forgery, and replay attacks. Verified aggregated signatures are dispatched to consumers, who can also efficiently verify correctness.
- **Timelock Encrypted Transactions Mechanism**: The IDN supports timelock encrypted transactions for future Drand rounds, enabling asynchronous and non-interactive coordination capabilities, front-running protection, and temporal privacy-preserving protocols.


### 🎲 VRaaS: Randomness Subscription Mechanism

Verifiable-Randomness-as-a-Service (VRaaS) is a subscription-based 'entropy daemon' for parachains and smart contracts. The IDN manages subscriptions and dispatches pulses of verifiable randomness to subscribers, allowing parachains and smart contracts to subscribe to and receive injected randomness using XCM-based adapters. Subscriptions determine when and where randomness should be delivered, enabling fine-grained, automated, trustless, and on-chain randomness without manual intervention.

[diagram]

For parachain and smart contract developers, this unlocks a new capability, as they acquire randomness that is actionable, not just usable. Subscribed randomness can drive state changes, trigger smart contract logic, or gate access to critical operations, enabling provably fair games, lotteries, auctions, randomness-based governance, and many more protocols requiring fairness or covert coordination.

We offer an SDK and XCM adapter library to simplify integration with the IDN for both FRAME pallets and smart contracts. Developers can easily subscribe to and receive verifiable randomness from the comfort of their own runtime. Delivery via XCM follows finality of the IDN, and messages are trustlessly executed on the destination using standard cross-chain proof validation. No trust assumptions beyond finality and proof verification are required. 
TODO [links?]

### ⏲️ Timelocked Transactions Support
The Drand randomness beacon produces BLS signatures that support timelock encryption, a cryptographic technique that allows for “encryption to the future”. Timelock encryption provides temporal confidentiality, meaning that blockchain transactions can be encrypted for future execution without leaking information in advance. By bridging Drand to Polkadot, the IDN  brings timelocked transaction capabilities to the ecosystem, manifested as a native MEV-resistant transaction pool within the Ideal Network. These cryptographic timelocks eliminate the need for commit-reveal schemes or trusted intermediaries, enabling secure and verifiably fair coordination in a completely decentralized way. 


## Supporting Technologies 

The IDN relies on the Drand distributed randomness beacon as a source of verifiable randomness and leverages the Polkadot relay chain for its efficient BLS signature verification, shared security and easy delivery of cross-chain messages.

### Drand 
Drand is a battle-tested distributed randomness beacon (DRB) operated by a consortium of mutually incentivized node operators called the League of Entropy. More specifically, Drand’s “Quicknet” is a DRB that uses threshold BLS signatures (on curve BLS12-377) using type III pairings. Every three seconds, it outputs unpredictable and unbiased verifiable randomness in the form  of a “pulse”, which contains the current round, signature, and hash of the signature, referred to as randomness. We can efficiently verify the signature by knowing the public key of the beacon and the corresponding round number. 

For a technical overview of Drand, refer to: https://hackmd.io/@cryptoecon/SyLzsm862.
Note: While the IDN currently relies on Drand as a source of verifiable randomness,  this is an intermediate step. Moving forward, future versions of the protocol will adopt a new cryptographic scheme based on “silent” threshold encryption (STE), removing reliance on Drand as a driver of the solution. This innovation will expand the capabilities of the IDN, which we elaborate on in the future work section.

### Polkadot
Polkadot supports efficient on-chain verification of BLS signatures (via bilinear pairings) without needing precompiles. As a result, we are able to efficiently ingest, aggregate, and verify pulses from Drand without expensive cryptographic overhead or offchain verification. In addition to being particularly well suited to efficiently compute pairings, Polkadot’s architecture also provides cross-chain support through cross-chain messages (XCM) to any parachain, enabling a decentralized, cheap and trustless channel through which the IDN can disseminate pulses across the ecosystem. Using DOT as our native currency ensures we can offer a fair and universal price for our system. -->
