# Overview

EtF Network is a [Substrate](https://github.com/paritytech/substrate.git)-based blockchain that utilizes identity-based encryption and zero knowledge proofs to enable "encryption to the future." Encryption to the future, similar in idea to timelock encryption, uses a slot-based consensus system as a reference clock to which messages can be encrypted. Valid blocks authored in future slots contain the corresponding secret keys. The initial version of our network uses a fork of Aura to implement a PoA version of EtF.  

## Getting Started

- Learn about [how Etf works](./architecture.md)
- See the [getting started guide](./getting_started.md) for an in-depth guide on running your own node.

### Repos

- [Etf Network](https://github.com/ideal-lab5/substrate/tree/milestone1) The implementation of etf consensus along with the etf pallet.
- [Etf Network Monitor](https://github.com/ideal-lab5/etf-monitor) A simple React app using polkadotjs to decode block headers and display decoded slot secrets.

## Contact

driemworks@idealabs.network
https://idealabs.network

## License
These docs and the code for both etf-network and etf-monitor are licensed as GPlv3.0.


This project is sponsored by a [web3 foundation grant](https://github.com/ideal-lab5/Grants-Program/blob/master/applications/cryptex.md). The work presented here represents the first milestone of the grant.