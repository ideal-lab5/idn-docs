---
sidebar_position: 1
---

# Ideal Network

###### Interoperable Decentralized Entropy Aggregation Layer

## Overview

The Ideal Network (IDN) is the **interoperable decentralized entropy aggregation layer**. It enables [interoperable randomness beacons](./learn/interoperable_randomness_beacons.md) for substrate-based chains, a transparent, auditable, and verifiable format for randomness beacons that can easily be used on-chain and at scale. It allows for high-throughput, low-latency, *use-case-specific* generation of publicly verifiable randomness that can be used in protocols, runtimes, and most importantly - it is *interoperable* in many different senses:

- easily made available across chains (e.g. with XCM)
- pulses of randomness are given a partial causal ordering  

We also enable **timelock encryption** on top of each IRB, enabling new kinds of fair and trustless on-chain protocols. While a single beacon, produced through an MPC protocol, is powerful, there is no inherent safeguard against malicious or compromised beacons. However, by aggregating IRB pulses into our **Entropy Mesh**, a *Merkle Clock*, we are able to easily verify. compare, and combine beacons in meaningful ways. This not only ensures that the IDN can produce 'good' randomness even in the presence of malicious or compromised beacons, but also cross-chain protocols that use independent sources of randomness.

## How does it work?
 
Our primary beacon is constructed and secured by the IDN validators. They are incentivized to participate in an extra voting round after they fetch a finalized block, with each authority proposing a new threhsold BLS signature and DLEQ proof (a type of zk proof) which allows for efficient on-chain verification.   

## Who is it for?

The Ideal Network's capabilities are incredibly wide-ranging and somewhat difficult to narrow down with the broad impacts that it can have on many different protocols and architectures. By using the different capabilities (randomness, tlock, witness encryption) across chains, the network allows for new programmable privacy, multiparty interactions, and dynamic behaviors that apply across many different areas of interest, such as privacy-preserving communications, gaming, defi, and more.

## Where are we?

## Learn More

- Read the latest news on our [substack](https://ideallabs.substack.com/)!

## Contact

- Join the conversation on [Discord](https://discord.gg/4fMDbyRw7R)
- Join us on matrix! https://matrix.to/#/#ideal-labs:matrix.org
- hello@idealabs.network
- https://idealabs.network

## License
These docs and the code for both etf, etf.js, and the etf-sdk are licensed as GPLv3.0.

![w3fblk](https://raw.githubusercontent.com/ideal-lab5/etf/main/resources/web3%20foundation_grants_badge_black.png)
This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md).