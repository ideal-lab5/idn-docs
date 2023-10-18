# ETF Network

## Getting Started

- Learn about [how Etf works](./architecture.md)
- See the [getting started guide](./getting_started.md) for an in-depth guide on running your own node.
- Build apps with [etf.js](./etf_js.md)


## What is it?

The ETF network ("Encryption to the Future"), powered by identity based encryption and zero knoweldge proofs, is a [Substrate](https://github.com/paritytech/substrate.git)-based blockchain that implements a novel "proof-of-extract" consensus mechanism where network authorities leak secrets over time. The initial implementation uses a fork of Aura to implement a proof-of-authority version of EtF. The network acts as a cryptographic primitive enabling timelock encryption, unlocking innovative use cases such as sealed bid auctions and voting, front-running protection, and trustless atomic MPC protocols. 

## Who is it for?

The ETF network is for anyone who uses the internet! In its current form, anyone can read block headers and extract secrets from the predigest, which can be used for timelock encryption or as a randomness beacon. This functionality can be added to existings applications with the [etf.js](./etf_js.md) library. In the future, we will extend this functionality with cross-chain bridges.


## Where are we?

We're nearing the completion of [our first web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/dkg/applications/cryptex.md)! In the next phase of the project, we intend to redesign our consensus mechanism to be based on proof-of-stake by implementing a proactive secret sharing scheme and integrating it with [Babe](https://wiki.polkadot.network/docs/learn-consensus), ensuring that the network can more securely scale. 

![w3fblk](./assets/web3%20foundation_grants_badge_black.png)
This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md).

## Contact

- Join us on matrix! https://matrix.to/#/#ideal-labs:matrix.org
- https://idealabs.network

## License
These docs and the code for both etf-network, etf.js, and the etf-sdk are licensed as GPlv3.0.
