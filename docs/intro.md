---
sidebar_position: 1
---

![](../static/assets/idn_logo.png)

# 

> These docs are a WIP.

## Overview

The Ideal Network (IDN) is an interoperable and decentralized randomness beacon. Built with [Substrate](https://substrate.io/), it is a blockchain that generates publicly verifiable on-chain randomness on top of each block finalized by the network. The beacon outputs pulses of randomness that can be trustlessly verified, allowing the output of the beacon to be used in various on/off-chain scenarios. It allows blockchains to easily acquire verifiable randomness. The IDN is intended to be used in the context of a [parachain](https://wiki.polkadot.network/docs/learn-parachains), which allows the output to be *interoperable* across many different blockchains. 


## How does it work?
 
The beacon operates as a *multiparty computation protocol*. It is an extra voting round that runs on top of each finalized block, similar in concept to [beefy](https://wiki.polkadot.network/docs/learn-consensus#bridging-beefy). The beacon is constructed and secured by the network's collators. Each participant produces a threshold BLS signature on top of the finalized block hash. If at least a threshold of collators honestly participate, then the protocol will produce a set of signatures that can be combined (by interpolation). The resulting signature is verified with a type of zero-knowledge proof called a DLEQ proof.

## Who is it for?

coming soon

## Where are we?

roadmap coming soon

## Supporters 
![w3fblk](https://raw.githubusercontent.com/ideal-lab5/etf/main/resources/web3%20foundation_grants_badge_black.png)
This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md) and the web3 foundation's [Decentralized Futures](https://futures.web3.foundation/) program.

## Learn More

- Read the latest news on our [substack](https://ideallabs.substack.com/)!

## Contact

- Join the conversation on [Discord](https://discord.gg/4fMDbyRw7R)
- Join us on matrix! https://matrix.to/#/#ideal-labs:matrix.org
- hello@idealabs.network
- https://idealabs.network



## License
These docs and the code for both etf, etf.js, and the etf-sdk are under the MIT license.
