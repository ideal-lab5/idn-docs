---
sidebar_position: 3
title: Timelocked Transactions
---

> 🚧 This page is under construction. Come back later!

<!-- # Shielded Transactions

The Drand randomness beacon produces BLS signatures that support timelock encryption, a cryptographic technique that allows for “encryption to the future”. Timelock encryption provides temporal confidentiality, meaning that blockchain transactions can be encrypted for future execution without leaking information in advance. By bridging Drand to Polkadot, the IDN  brings timelocked transaction capabilities to the ecosystem, manifested as a native MEV-resistant transaction pool within the Ideal Network. These cryptographic timelocks eliminate the need for commit-reveal schemes or trusted intermediaries, enabling secure and verifiably fair coordination in a completely decentralized way. 

[Diagram showing how this works]

To prevent spamming, abuse, and other issues that can arise due to competition in scheduling, we introduce a novel VCG-inspired future blockspace auction mechanism per Drand pulse that we ingest. Modeled as a VCG mechanism with a “greedy” optimization, this mechanism ensures fair pricing with incentive-aligned prioritization, making “execution timing” an economically programmable primitive, like gas for compute. 

The initial version of the IDN does not extend MEV elimination across chains; it is only available natively within the network. However, timelocked transactions can still enable cross-chain coordination, where transactions across chains, issued as timelock encrypted XCM to the Ideal Network, can be guaranteed to be dispatched simultaneously from the Ideal Network. This capability, covert coordination, can form the basis for developing fair cross-chain protocols (e.g. trustless cross-chain atomic asset swaps).

For an overview of the math involved in our timelock encryption scheme, you can navigate to  our documentation or jump straight into the repo. Our implementation was funded by the web3 foundation and builds on the formal security proofs presented in research by Protocol Labs.


Our implementation is a hybrid encryption scheme using the Boneh-Franklin Identity Based Encryption scheme to perform a key exchange with a future output of a randomness beacon, while messages are encrypted under AES-GCM for performance and size. The BLS signatures (on curve BLS12-381) output by the Drand randomness beacon (every 3s) are each signatures on a unique message that increases monotonically with each round of the protocol (e.g. Sha256(1), Sha256(2), Sha256(3), and so on). By encrypting with a random secret to this message as an identity, we produce a ciphertext that can be decrypted by the signature output from the randomness beacon during the given future round. This enables a non-interactive, verifiable, time-gated encryption mechanism with short ciphertexts and no trusted setup. -->
