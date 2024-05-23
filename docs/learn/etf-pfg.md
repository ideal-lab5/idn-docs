---
sidebar_position: 1
---

# ETF Post-Finality Gadget

This is an overview of the Ideal Network's post-finality gadget. We first describe the mechanism at a high level and then will dive into the architecture.

## Overview

The ETF-PFG functions similar to the [BEEFY](https://polkadotters.medium.com/from-kusama-to-polkadot-beefy-protocol-set-to-standardize-cross-chain-consensus-1e836bce774b) post-finality gadget (from which it is adapted). It leverages [efficient aggregatable BLS signatures](https://eprint.iacr.org/2022/1611). To begin, the network is seeded with a 'resharing' of a master secret, where we produce a single share per network authority. Each resharing is an output of our ACSS add link later (ACSS) protocol. On top of each finalized block, each authority uses the ACSS 'recovery' algorithm to extract their secret share from the publicly published 'resharing'. Using this, they produce a threshold BLS signature and DLEQ proof

![etf overview](../../static/assets/etf_overview.png)

For more details on the ACSS protocol and the rest of the underlying crypto, check out the [crypto] here.

### Seeding the Protocol

First, we produce master secret key offchain prior to genesis. In the future we will likely replace this with a fully-fledged distributed key generation mechanism. We also define an initial set of network authorities, for which we produce a sharing of the secret key. 

The encrypted shares are stored on-chain within the 'ETF' pallet (described below). 

### The ETF Worker

Each authority participating in the PFG does so by using an ETF worker. The ETF worker uses the local keystore to recover their secret shares from the encrypted shares added to runtime storage on genesis. Each worker uses the recovered share to produce a BLS signature, where they sign a commitment to the current last finalized block for which they haven't produced a signature. That is,  a commitment is essentially just a block number.

On top of this commitment, the threshold BLS signature if broadcast as a 'vote message', where we define a vote message as:

$M_v = (C, A_{id}^{etf}, A_{sig})$

Where $C$ is the commitment, $A_{id}^{etf}$ is a publcly known commitment to the expected resharing that this participant will recover, and $A_{sig}$ is the actual threshold BLS signature. 

Each worker constructs a vote message and gossips it to its peers. If the signature can be verified on the expected commitment, then we can produce a 'signed commitment', which is essentially just the commitment with a collection of each threshold BLS signature that was produced on top of it. 

Once a worker receives each vote message and verifies them, they each output the signed commitment as a 'justification', which we can read by subscribing to an RPC endpoint.

## Pallets

The network requires a pallet, the etf-pallet, to function. The etf-pallet stores public parameters that are required to enable identity based encryption. These values are calculated offchain and encoded in the genesis block.

### ETF Pallet

The ETF pallet stores public parameters needed for the IBE scheme. The values are set on genesis and only changeable by the root user (via the Sudo pallet) when they call the `update_ibe_params` extrinsic. The extrinsic uses Arkworks to decode the input to ensure that the provided data is a valid element of G2, and if so then it encodes it in storage. In the future, we intend to make this a more democratic process.

### Beefy-ETF Pallet

The Aura pallet included in the etf node is a modified version of the standard Aura pallet. Our version holds a new runtime storage map to hold slot secrets, which are added to storage in the `on_initialize` hook. 

## Consensus and Encryption to the Future

> :warning: This describes version 1 of our consensus mechanism. We are in the process of updating to version 2, which uses dynamic committee proactive secret sharing to further decentralize and scale the network's authority set. 

Here we present a high-level overview of how the consensus mechanism works. The goal of our consensus mechanism is to leak **publicly verifiable** IBE (identity based encryption) secrets within each block header.

There are four major phases:

1. **Setup**: IBE Setup, slot identification scheme, and blockchain genesis 
2. **Authority Selection**: Round-robin authority selection (i.e. aura)
3. **Claim a slot**: Block authors claim a slot. When doing so they calculate an IBE secret for the identity and corresponding DLEQ proof, and include it in the new block header
4. **Block verification**: Block importers verify the DLEQ proof when checking the block’s validity

The initial version of the network uses a fork of Aura, a round-robin proof of authority consensus mechanism. Each authority is an **IBE master key custodian**, which is created in the IBE setup phase. This requires trust in each authority, a requirement we will relax in the future. 

When a slot author proposes a block, they first use the master secret to calculate a slot secret (the IBE extract algorithm), which they add to the block header. This slot secret is intended to be **leaked** and made public. In order to ensure the correctness of the secret to be leaked, block producers include a DLEQ proof that shows the slot secret was correctly calculated. Along with this, they also sign the block as usual. 

Block importers simply verify the DLEQ proof. If the DLEQ proof is not valid, the block is rejected. 

![high-level](../../static/assets/high_level_flow_of_data.drawio.png)

Whenever a block is authored in a slot, the slot secret can then be extracted and used. Essentially, the blockchain is building a table of IBE secrets and public keys which grows at a constant rate and whose authenticity and correctness is ensured by consensus.

![etf-monitor](../../static/assets/etf_monitor.png)

### Slot Identity

In our proof-of-authority based network, there is a known set of authorities, say $A = {A_1, …, A_n}$, from which block authors are  sequentially selected (round-robin). That is, for a slot \\(sl_k\\), the authority to author a block in the slot is given by $A_{sl_k} = A[sl_k \mod |A|]$. A slot’s identity is given by $ID_{sl_k} = sl_k$. We simply use the slot number as the slot identity. For example, a slot id could look like `0x231922012`, where `231,922,012` is the slot number. We preserve the authoritiy's standard block seal within the block header in order to keep slot identities simple.

To get a public key from the slot id, we use a hash-to-G1 function, which gives us public keys in G1 (the elliptic curve group we’re working with). That is, each slot implicitly has an identity, and by evaluating the id under the hash-to-G1 function, a public key in G1. 

### Claiming a Slot

When a block author claims a slot, they perform the extract algorithm of the IBE scheme, where they use their slot public key along with the master secret to calculate the slot secret (e.g. d = sQ where s is the master secret and  is the public key). In order to do this, we introduce new functionality to the existing AuraAPI which allows slot authors to fetch the IBE public parameters, which are stored in the etf pallet, as well as read the master secret from local storage. 

After calculating the slot secret, the slot author is tasked with preparing a DLEQ proof that the slot secret was calculated from the master secret. We accomplish this by implementing a trait which enables DLEQ proof and verification, using Arkworks. It allows the prover to demonstrate that, given some xG and xH, that both were calculated from x without revealing the value.  In our scheme, one of the values is the slot secret, `d = sQ`, and the other is the master secret multiplied by the public param stored in the etf pallet. The DLEQ proof is then encoded within the block header when it is proposed by the author. That is, each block header contains a PreDigest which contains the slot id, the slot secret, and the DLEQ proof like so:

``` rust
PreDigest: {
    slot: 'u64',
    secret: '[u8;48]',
    proof: '([u8;224])'
}
```

### Importing and Verifying Blocks

When a block importer receives a new block, they first check that the slot is correct. If correct, then they recover the DLEQ proof from the block header and verify it along with the block seal (which is still a normal Schnorr signature). If the DLEQ proof is valid, then we know the slot secret is valid as well. If the proof is invalid, then the secret is incorrect and the block is rejected.

### Consensus Error Types

Block producers and importers are given two new consensus error types [here](https://github.com/ideal-lab5/substrate/blob/502032949307b1c19cba606dbef1d2f108f71a56/primitives/consensus/common/src/error.rs#L53). For **block producers**, the `InvalidIBESecret` is called when the aura client cannot fetch a master IBE secret from local storage. For **block importers**, `InvalidDLEQProof` is triggered when a DLEQ proof cannot be verified. This is very similar in functionality to the `BadSignature` error type.
