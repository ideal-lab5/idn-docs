# EtF Network Overview

The ETF Network is a blockchain built with [Substrate](). Its core functionality revolves around its novel consensus mechanism, "Authoritative Proof-of-Knowledge", which uses **identity based encryption** and **DLEQ proofs** to leak a new "slot secret" within each authored block. The initial implementation is built on top of the Aura proof of authority consensus mechanism. 

Check out the links below for a deep dive into the components:
- [etf network and consensus](./architecture.md)
- [etf sdk and encryption](./etf_sdk.md)
- [(d)apps and light client](./etf_js.md)
- Use Cases
  - [timelock auction](./timelock_auction.md)


The Etf.js and Etf SDK are a modular tech stack that supports the development of various applications that use the etf network. Developers are provided with tools to verify proofs and to perform timelock encryption against the ETF network. The platform also provides a framework for builders to define and implement their own protocols on etf, enhancing the adaptability and customization potential of the network's offerings. Currently, etf.js supports connections from (smoldot) light clients and full nodes only.

![architecture overview](./assets/architecture.png)

