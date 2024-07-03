---
sidebar_position: 1
---

# Ideal Network

###### The interoperable entropy layer

## Overview

From securing web traffic, to fair resource allocation and I/O randomness in gaming, the applications and uses of random numbers is truly foundational for the web. While traditional centralized systems can cheaply access pseudo-random numbers, decentralized systems face challenges in acquiring unbiased on-chain randomness. Oracles can be used to inject randomness onchain, but without verifility they require a great deal of trust. Solutions such as [Chainlink VRF](https://docs.chain.link/vrf) and [Drand](https://drand.love) exist to full this gap, using verifiable random functions and threhsold BLS signatures respectively, to produce unbiased randomness. However, Chainlink VRF incurs a high cost and latency to obtain randomness, making it unsuitable for real-time applications, while drand's system lacks easy interoperability and economic incentives for participation. To solve these issues we introduce the "Encryption-to-the-Future" Post-Finality Gadget (ETF-PFG), a protocol run on the Ideal network that enables interoperable publicly verifiable randomness across bridged chains. This, coupled with our novel **entropy mesh**, which aggregates many sources of randomness into a verifiable, auditable structure, opens new possibilities for trustless, fair applications and protocols.

The goal of the Ideal Network is to enable *interoperable* (i.e. cross-chain) publicly verifiable on-chain randomness, timelock encryption, and practical witness encryption capabiltities. 

## What is it?

The Ideal network is a Substrate-based blockchain. It is a multiparty computation (MPC) solution inspired by other randomness beacons, such as [drand](https://drand.love/docs/overview/). It uses threshold BLS signatures and DLEQ proofs to produce unbiased, publicly verifiable on-chain randomness. The goal of the network is 'symbiotic' in nature - we aim to 'supercharge' bridged chains by providing them with source of onchain randomness. This randomness can be easily relayed across chains using a light client running on the target chain. 

By enabling an efficient randomness beacon, we also provide new "programmable privacy" capabilities for blockchains, including:

- timelock encryption: where messages can be locked until a future block
- practical witness encryption: where messages can only be decrypted when a participant proves they meet some condition or know some knowledge

## Who is it for?

The Ideal Network's capabilities are incredibly wide-ranging and somewhat difficult to narrow down with the broad impacts that it can have on many different protocols and architectures. By using the different capabilities (randomness, tlock, witness encryption) across chains, the network allows for new programmable privacy, multiparty interactions, and dynamic behaviors that apply across many different areas of interest, such as privacy-preserving communications, gaming, defi, and more.

## Where are we?



## Learn More

- Read the latest news on our [substack](https://ideallabs.substack.com/)!

## Contact

- Join the convo on [Discord](https://discord.gg/4fMDbyRw7R)
- Join us on matrix! https://matrix.to/#/#ideal-labs:matrix.org
- hello@idealabs.network
- https://idealabs.network

## License
These docs and the code for both etf, etf.js, and the etf-sdk are licensed as GPLv3.0.

![w3fblk](https://raw.githubusercontent.com/ideal-lab5/etf/main/resources/web3%20foundation_grants_badge_black.png)
This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md).