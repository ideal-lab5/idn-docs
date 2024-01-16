---
sidebar_position: 1
---

# ETF Network

![w3fblk](https://raw.githubusercontent.com/ideal-lab5/etf/main/resources/web3%20foundation_grants_badge_black.png)
This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md).

## Getting Started

While blockchains provide a basis for freeing us from centralized authority through a shared digital ledger, they are still prone to the same problems as traditional banking. Reliance on a centralized authority is only part of the problem, the rest is about how we each trust and communicate with each other. While this is more of a human issue and not one of technology, this project aims to enable onchain trustless multiparty protocols that allow many participants to simultaneously compete using the same source of randomness. These types of protocols are:

- **non-interactive**: participants do not need to interact with or have knowledge of each other in order to participate
- **eventually-consistent**: the protocol can be guaranteed to complete by a deadline for all honest players
- **front-running resistant**: participants can keep their inputs sealed until a specific future deadline, at which point they are simultaneously revealed

## What is it?

The ETF network ("Encryption to the Future") is a [Substrate](https://github.com/paritytech/polkadot-sdk)-based blockchain that implements a novel consensus mechanism where network authorities leak secrets over time. Powered by identity based encryption and zero knoweldge proofs, the network acts as a cryptographic primitive enabling:

- publicly verifiable onchain randomness
- non-interactive timelock encryption with no restrictions
- secure delayed transactions with timelock encryption, providing front-running protection and other unique capabilities

## Who is it for?

The ETF network's capabilities are for everyone. At the current stage, using the network is mainly for developers. The ETF network can be used by anybody who wants to integrate timelock encryption, onchain randomness, or delayed transactions into their applications, smart contracts, or other systems.

- Timelock encryption and delayed transactions can act as powerful tools to build trustless multiparty protocols. 

- Publicly verifiable onchain randomness provides smart contracts with the ability to use random numbers within function, enabling non-interactive coin-flip protocols within smart contracts.

For example, the ETF network can be used to build more engaging web3 games by relying on onchain randomness and using delayed transactions to orchestrate simultaneous player actions.

This functionality can be added to existing applications with the [etf.js](https://github.com/ideal-lab5/etf.js) library. Check out the [react based timelock encryption](https://github.com/ideal-lab5/etf.js/tree/main/examples/react-tlock) to see how it works.


## Where are we?

This project is still under heavy development. 

We just completed [our first web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/dkg/applications/cryptex.md)! With this, we have:

- implemented a proof-of-authority version of our consensus mechanism
- implemented timelock encryption and developed a typescript SDK for easy integration into apps
- built a [timelock auction](/docs/examples/timelock_auction.md) where bids are sealed with timelock encryption

In the next phase of the project, we aim to deliver onchain randomness, secure delayed transactions, and an upgrade to our consensus mechanism. Along with this, we will also introduce governance to the system.

- [x] delayed transactions
- [ ] publicly verifiable onchain randomness (in smart contracts)
- [ ] consensus upgrade
- [ ] governance

## Learn More

- Read the latest news on our [substack](https://ideallabs.substack.com/)!

## Contact

- Join us on matrix! https://matrix.to/#/#ideal-labs:matrix.org
- https://idealabs.network

## License
These docs and the code for both etf, etf.js, and the etf-sdk are licensed as GPLv3.0.
