---
sidebar_position: 3
title: Use Cases
---

### Why It Matters

The Ideal Network provides new capabilities to Polkadot parachains that previously required centralized workarounds, hand-waving, or relied on trust in authority or a process rather than actual cryptography.

| **Problem Today**                                                              | **Without IDN**                                                                  | **What IDN Enables**                                                                    | **Example Use Cases**                                                    |
| ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **MEV & Frontrunning**: Public mempools leak user intent                       | Transactions rely on miner honesty, complex private mempools, or sequencer trust | **Timelock-Enforced Confidentiality**: Transactions are hidden until execution          | MEV-resistant swaps, sniping-proof liquidations                          |
| **Commit-Reveal Fragility**: Reveals can be delayed or withheld                | Requires multi-step commit/reveal logic, off-chain coordination                  | **Simultaneous, Verifiable Reveals**: One-shot, non-interactive commitments             | Sealed-bid auctions, zero-leak governance votes                          |
| **Lack of Privacy in Governance**: Votes are public before tally               | Vote buying, coercion; partial zk or off-chain schemes                           | **Private, Timed Voting**: Ballots decrypted only at conclusion                         | DAO proposals, zk-governance mechanisms                                  |
| **Unfair or Trust-Based Games**: Moves revealed or coordinated off-chain       | Requires trusted server or player honesty                                        | **Trustless Multiplayer Coordination**: Asynchronous, secret moves with fair reveal     | Rock-paper-scissors, poker, prediction markets                           |
| **Bridging Requires Identity or Syncing**: Cross-chain coordination is brittle | Relayers, watchtowers, trusted bridges                                           | **Covert Cross-Chain Actions**: Time-triggered messages with no off-chain coordination  | Trustless swaps, composable IBC replacements                             |
| **No Native Timed Access**: Hard to enforce unlock schedules                   | Centralized timestamp servers, block-height hacks                                | **Time-Gated Smart Contracts**: Assets/actions unlocked cryptographically at a set time | Event ticketing, time-sensitive access, auto-publishing                  |
| **Key Custody & UX Bottlenecks**: Private key management is hard               | Requires secure wallets, recovery schemes, seed phrases                          | **Keyless Protocols**: Timelocked recovery, one-time secrets, ambient access            | [Murmur wallet](https://murmur.idealabs.network), time-released airdrops |
