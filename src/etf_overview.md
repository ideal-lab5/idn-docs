# EtF Network Overview

The ETF Network is designed as a proof of authority blockchain, developed on the Substrate framework. Its core functionality revolves around a hybrid consensus mechanism that empowers the network to serve as a cryptographic primitive, facilitating timelock encryption, specifically referred to as "encryption to the future."

The Etf.js and Etf SDK are a modular tech stack that supports the development of various applications that use the etf network. Developers are provided with tools to encrypt messages, utilizing a default hybrid AES/ETF scheme. However, the platform also affords the flexibility for builders to define and implement their own protocols, enhancing the adaptability and customization potential of the network's offerings. Currently, etf.js supports connections from (smoldot) light clients and full nodes only.

![architecture overview](./assets/architecture.png)

Check out the links below for a deep dive into the components:
- [etf network and consensus](./architecture.md)
- [etf sdk and encryption](./etf_sdk.md)
- [(d)apps and light client](./etf_js.md)
