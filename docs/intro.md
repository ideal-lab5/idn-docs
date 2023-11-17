---
sidebar_position: 1
---

# ETF Network

Encryption to the Future!

![w3fblk](https://raw.githubusercontent.com/ideal-lab5/etf/main/resources/web3%20foundation_grants_badge_black.png)
This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md).

## Getting Started


## What is it?

The ETF network ("Encryption to the Future"), powered by identity based encryption and zero knoweldge proofs, is a [Substrate](https://github.com/paritytech/substrate.git)-based blockchain that implements a novel "proof-of-extract" consensus mechanism where network authorities leak secrets over time. The network acts as a cryptographic primitive enabling publicly verifiable randomness and timelock encryption. 

## Who is it for?

The ETF network is for anyone who uses the internet! In its current form, anyone can read block headers and extract secrets from the predigest, which can be used for timelock encryption or as a randomness beacon, no crypto wallet needed. Timelock encryption can act as a powerful primitive to enable trustless protocols. 

For example, trustless p2p games can leverage timelock encryption to minimize fraud or cheating in games, ensuring no player move can be predetermined by other players. When the game deadline is reached, plays can be simultaneously revealed. This can be thought of like having a secure deposit box that can only be unlocked at a certain time. Many participants can deposit messages into the box, but none can be read until the unlocking time. This functionality can be added to existing applications with the [etf.js](https://github.com/ideal-lab5/etf.js) library. Check out the [react based timelock encryption](https://github.com/ideal-lab5/etf.js/tree/main/examples/react-tlock) to see how it works.

We are currently working on a delayed transactions framework, where participants can delay transactions for specific future blocks using timelock encryption. This lays the groundwork for trustless MPC protocols within smart contracts, with a non-interactive reveal phase. To make an analogy, this is like having a timelocked vault like above, except it's spring-loaded to open at a specific time.

## Where are we?

This project is still under heavy development. 

We just completed [our first web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/dkg/applications/cryptex.md)! With this, we have:

- implemented a proof-of-authority version of our consensus mechanism
- implemented timelock encryption and developed a typescript SDK for easy integration into apps
- built a [timelock auction](/docs/Timelock-Auction/getting_started.md) where bids are sealed with timelock encryption

In the next phase of the project will enable delayed transactions through the ETF network, which in turn enables trustless MPC protocols to be implemented as smart contracts on the network. Phase II includes:

- redesigning our consensus mechanism to be proof-of-stake by implementing a dynamic-committee proactive secret sharing scheme and integrating it with [Babe](https://wiki.polkadot.network/docs/learn-consensus)
- implementing a delayed transactions framework using timelock encryption
- tools and utilities to use delayed transactions and build dapps with them

## Learn More

- Read the latest news on our [substack](https://ideallabs.substack.com/)!

## Contact

- Join us on matrix! https://matrix.to/#/#ideal-labs:matrix.org
- https://idealabs.network

## License
These docs and the code for both etf, etf.js, and the etf-sdk are licensed as GPlv3.0.
