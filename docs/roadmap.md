---
sidebar_position: 10
title: Roadmap
---

## Development Roadmap

### v0: pragmatic beginning

The initial iteration of the Ideal Network serves as a pragmatic approach to enabling VRaaS and timelocked transactions.
Here, the Ideal Network acts as a semi-trusted oracle from Drand's Quicknet to parachains, powered by an XCM-powered subscription system.

- introduces new cryptographic capabilities and controls to Polkadot
  - brings efficient VRaaS to Polkadot
  - enables cryptographic MEV resistance + covert coordination via timelock encryption
- acts as infrastructure for all parachains and explores XCM in depth -> need to elaborate

- While pragmatic, it is somewhat *crude*, with several limitations.
  - it is semi trusted: pulse ingestion and timelock decryption is dependent on trusted collators who ingest data from an external system.
  - can only process ~100 VRaaS subscriptions per block
  - limited to ~150-300 timelocked txs per block, with a FIFO queue

### v1: greater scalability + decentralization
The intention of this next iteration is to address the scalability and trust issues of IDN v0, while preserving the cryptographic mechanisms and subscriptions implementation.

- update the tx pool: we add a real tlocked transaction pool, not just scheduled txs.
  - no longer requires the initial unshielded 'schedule' transaction
  - theoretically, should be cheaper for users while increasing privacy
- move from PoA driven ingestion + tlock decryption to a PFG driven one
  - increased scalability: instead of limiting to 150-300 tlock txs/sec, we can set however many we want
  - no longer requires trust in a single collator for tlock decryption + pulse ingestion, instead it is fully trustless

- while requiring less trust and being more scalable, it is still reliant on Drand.
  - timelock encryption still only works against Drand round numbers, while ideally users would benefit from encrypting to their own chain's block numbers, with the goal being to provide cross-chain MEV elimination and conditional execution, not just the Ideal Network
  - it's also still inherently fragile due to the limitations of BF-IBE based timelock encryption:
    - once a ciphertext has been encrypted for a deadline and published, it is always decryptable at the deadline. This means that canceling a timelocked ciphertext's execution, while possible, does not prevent it's content from being knowable.
    - Timelock decryption cannot be batched, only allowing ciphertexts to be decrypted one at a time. This provides a strict upper bound on the number of transactions that we can decrypt with any give timeframe.

### v2: practical witness encryption

The intention of this next iteration is to address the limitations of v1. Specifically, we aim to be able to provide universal MEV protection and, further, conditional execution and access control capabilities. That is, in the ideal version, parachains should be able to offer MEV protection to *all* transactions as if it were a native capability, with the IDN acting as the invisible infrastructure underneath. Beyond MEV, v2 aims to provide another new capability to web3/parachains: on-chain conditional access control. That is, 

- instead of relying on Drand, we integrate a silent thresold encryption library that Ideal Network will be working on as well in parallel to v1.
  - this not only allows us to remove reliance on Drand and use a committee who is economically motivated in relation to the performance of the network, but also enables internet-scale performance, with STE providing a 100x performance increase in decryption (TODO: that's not true, I need to get the real #, but STE does 1000 decryptions in ~ 7ms, very fast).
  - Instead of encrypting transactions to Drand round numbers, we integrate more advanced proving schemes, allowing for encryption to finalized block numbers on any chain integrated with the IDN.
- the system becoems fully permissionless, trustless, and autonmous.
- Q: Do we ever introduce our own token? Do we use DOT forever? do we introduce a token but still let DOT be used? 
