---
sidebar_position: 1
title: Pulse Ingestion Protocol
---

# IDN V0 Architecture & Design

This document describes the Ideal Network's "Phase 1" release as a trustless bridge from Drand to Polkadot.

## Overview

The Ideal Network's 'phase 1' introduces a trustless bridge from the Drand distributed randomness beacon to the Polkadot ecosystem, providing publicly verifiable randomness with low-latency and low-cost while enabling timelock encryption capabilities. The IDN is a cross-chain solution, with the goal being to allow parachain runtimes and ink! smart contracts to subscribe to randomness that is pushed to their network via XCM, minimizing latency and storage overhead. 

The network is foundationally a proof-of-authority blockchain using Aura consensus. In addition to this, each collator subscribes to a gossipsub topic, to which Drand's quicknet writes all new pulses. The network acts a **sparse accumlator** of drand pulses, able to consume, verify, and prove that it has observed (or not) any given pulse. The network authorities are responsible for submitting aggregated signatures to the runtime, which then becomes the block's randomness. In addition, the network is responsible for `managing` and `handling` subscriptions to randomness, which looks like a priority-ordered XCM-dispatcher layer.

## Background

### Terminology

- **Collator** - Similar to a network validator, except in the context of a parachain. This is a special authority node who can produce blocks.
- **Extrinsics and inherents** - Extrinsics are transactions within the network (applied to the runtime). Inherents are a special kind of *unsigned* extrinsic that can only be made by a block author. 
- **Verifiable Randomness Beacon** - A probabilistic machine that outputs **pulses** of randomness in periodic **rounds**. Each pulse contains the *round number*, *signature* and *randomness* for the round.  There is an efficient algorithm $V$ that can be used to publicly verify each pulse.
- **Multiparty Computation (MPC) Protocol** is a protocol that involves two or more parties that each individually compute *something* and share it amongst each other in order to compute a final output. The drand beacon protocol is a secure MPC protocol.
- **Gossipsub** [4] is a an extensible baseline pubsub protocol, based on randomized topic meshes and gossip. It is a general purpose pubsub protocol with moderate amplification factors and good scaling properties.
- **Listening** means that you can accept incoming connections from other peers, using whatever facility is provided by the transport implementation.
- **Dialing** is the process of opening an outgoing connection to a listening peer.
- **On-chain/off-chain**: An on-chain computations happens within the blockchain runtime. Anything else is called an off-chain computation.
---
### Notation
- For numbers $0 < m < n$, $[m, n]$ denotes the closed interval from $m$ to $n$. When $m = 1$, we write $[n]$ to denote the interval $[1, n]$.
-  When we are choosing an element $x$ of a set $X$ subject to a probability distribution $\mu$, we write $x \xleftarrow{\mu} X$. We write $x \xleftarrow{R} X$ to represent a uniform distribution. 
---

### System Model

We assume there is a *static* set of *collators*, denoted $P = \{P_i\}_{i \in [n]}$. Each collator possesses two keypairs, an **sr25519** keypair that they use to **seal** blocks and an **ed25519** keypair used to **finalize** blocks. Each collator broadcasts their public keys to the rest of the network participants and maintains secrecy of their secret keys. Collators operate in a synchronous network, where each receives messages from any other collator within a bounded length of time. In the event that a block author fails to author a block, the next node in the list becomes the valid leader. We do not punish nodes if they fail to author a block under this trust assumption (PoA). 

We assume a proof-of-authority (PoA) consensus mechanism called Aura [3] is used, where collators are selected as block authors in a round-robin fashion. That is, for block number $b$ we choose a block author based on their index in the list of collators, which is the authority at the $b \mod n^{th}$ index. For example, if we have 12 collators then any given collator is authorized to build every 12$^{th}$ block.

Each collator has access to a *gossipsub protocol* to which messages can be published and consumed based on topic, $\mathcal{G} = (P, S)$, where:

- $P: \{0, 1\}^* \times \{0, 1\}^n \to \{0, 1\}$ s.t. $P(t, m) = 1$ if the message is published successfully to the topic $t$, and $0$ otherwise.
- $S: \{0, 1\}^* \to \{0, 1\}^*$ is a stream that subscribes to each new message published to a topic $t$ and outputs it within some bounded amount of time. That is, if $P_i$ and $P_j$ are peers and $P_i$  publishes some $P(t, m)$, then when $P_j$ subscribes to $S(t)$ it will receive the message $m$. 


### The Drand Quicknet Beacon

Drand [[1]](https://drand.love/docs/cryptography) is a distributed randomness beacon that periodically outputs **pulses** of verifiable randomness. It operates as a multiparty computation (MPC) protocol where a static set of known workers, $W := \{W_i\}_{i \in [n]}$ (the "League of Entropy"), produce threshold BLS signatures using shares of a secret constructed through a distributed key generation mechanism. It executes in sequential, non-overlapping **rounds** whose identity is described by a monotonically increasing integer sequence starting at 0. To compute the *identity* for the round, we hash the round number to a unique point in the group $\mathbb{G}_1$ through what's called a "hash-to-G1" function, denoted $H_1$. Let $H: \{0, 1\}^* \to \{0, 1\}^d$ be a cryptographic hash function for some $d > 0$ (e.g. 32 bytes) and $H_1: \{0, 1\}^* \to \mathbb{G}_1$ a hash-to-G1 function.

There are several flavors of drand beacons, however, we use the Drand "Quicknet" beacon, which uses $\mathbb{G}_1$ as the signature group and $\mathbb{G}_2$ as the public key group using curve BLS12-381. It uses $\mathbb{Z}_p$ as the keyspace. We refer to this as TinyBLS381, with *small* signatures  (48 bytes) and large public keys (96 bytes). The beacon outputs every 3 seconds.

#### Setup Phase: Shamir's Secret Sharing

The protocol setup phases relies threshold secret sharing techniques to produce shares known to League of Entropy nodes such that, given at least a threshold of signatures on some message $M$, we can obtain a signature on $M$ that can be verified with the beacon's master public key. Here, we present a simplified version of the Drand DKG ceremony as basic Shamir's secret sharing. The goal of the DKG is to ensure that an adversary must corrupt above some threshold of nodes in order to corrupt the system. In our case, as long as there are $0 < t \leq n$ uncorrupted nodes, then the protocol can continue successfully.

1. A trusted dealer chooses some $sk \xleftarrow{R} \mathbb{Z}_p^*$ and $f(x) = sk + a_1 x + ... + a_tx^t$ where $0 < t \leq n$, $a_i \xleftarrow{R} \mathbb{Z}_p$
2. The dealer computes $u_i := f(i) \in \mathbb{Z}_p$ for $i = 1, ..., n$ and distributes a share $u_i$ to worker $W_i$.
3. The beacon public key is given by $pk = f(0) \cdot G \in \mathbb{G}_2$.

The secret key $sk$ can be recovered via Lagrange interpolation, which we denote by the algorithm $Interpolate$, defined as:

For values $y_1, ..., y_n$ that are evaluations of a polynomial $f$ at distinct points $x_1, ..., x_n$, we can recover the polynomial of degree $t \leq n$, evaluated at some $x^*$, by computing $f(x^*) = \sum_{i \in [k]} \lambda_i \cdot u_i$ where $t \leq k \leq n \in \mathbb{G}_1$ and each $\lambda_i = \prod_{j \in [k]\setminus \{i\}} \frac{x^* - x_j}{x_j - x_i}$ is called a Lagrange coefficient for the polynomial $f$ evaluated at $x^*$. 


#### Signing phase

Starting from round $r = 0$ and incrementing by $1$ each round, workers $W_i$ are responsible for outputting a signature using their share $u_i$, after which the threshold signatures can be interpolated to obtain a signature on the message by the secret key $sk$. They proceed as:

1) $\sigma_i = sk_i \cdot H_1(r)$ for a round number $r$
2) Compute $\sigma$ on $pk = sk \cdot G$ by interpolating the signatures (Lagrange interpolation): $\sigma = \sum_{i \in [k]} \lambda_i \cdot \sigma_i$ where $m \leq k \leq n \in \mathbb{G}_1$ and each $\lambda_i = \prod_{j \in [k]\setminus \{i\}} \frac{-x_j}{x_j - x_i}$ is a Lagrange coefficient for the polynomial $f$ evaluated at $0$. 

A **pulse** is then output as  $\{\sigma, H(\sigma), r\}$ where $\sigma$ is the interpolated signature, $H(\sigma)$ a cryptographic hash of the signature, and $r$ is the round number. 

#### Pulse Verification $(\mathcal{V})$

We can verify the signature by comparing the pairings: $e(\sigma, g2) == e(Q, pk)$ where $Q = H_1(r)$, $\sigma$ is the round signature, $g_2$ is a generator of the $\mathbb{G}_2$ group, and $pk$ in the public key associated with the beacon. This works since:

$e(\sigma, g2) = e(sk \cdot Q, g2) = e(Q, sk \cdot g2) = e(Q, pk)$

Let $\mathcal{V}$ represent the verification algorithm

We note that this can be optimized by computing a multi miller loop and taking its final exponentation, as in [[2]](https://github.com/noislabs/drand-verify/blob/9a760444f1981604c9cbbfaf59b18df70a4168ad/src/verify.rs#L307).

It is easy to show that a collection of pulses can also be verified by first aggregating them, then verifying the aggregated signatures and round numbers mapped to G1.

## Randomness Beacon Ingestion and Verification

Collators engage in round-robin leader selection to propose blocks based on observed messsages from the Drand beacon. Each authority subscribes to Drand's [Gossipsub topic](https://drand.love/developer/gossipsub/) to fetch beacon pulses. The `pallet-randomness-beacon` acts as a **sparse accumulator** that acts as a commitment that we have observed every pulse from a given genesis round to the latest observed round.
 
Let $\mathcal{D} = (sk^{(D)}, pk^{(D)}, \Delta_D, I, t, \mathcal{G} )$ represent Drand, where $sk^{(D)}$ is the full secret key (as discussed above) and $pk^{(D)}$ is the public key. The beacon outputs signatures $\sigma_r = sk^{(D)} * I[r]$ every $\Delta_D$ seconds and published it to the gossipsub topic $t$ using $\mathcal{G}$. That is, every $\Delta_D$ seconds a  pulse $\rho_r := (r, \sigma_r, H(\sigma_r))$ is published to the gossipsub topic where $r$ is the round number. That is, every $\Delta_D$ seconds $\mathcal{D}$ publishes the message $\mathcal{G}(t, \rho_r)$. When convenient, we will refer to $\mathcal{D}$ as both the beacon itself (that which executes the signing & interpolation stages) as well as its gossipsub layer, where we assume it has a public identity that can be dialed given by $\mathcal{D}_{ID}$.

![archgossip(1).drawio](https://hackmd.io/_uploads/ryCTzaK0yl.png)

On startup, each collator $P_i$:

1) Dials $\mathcal{D}_{ID}$ and waits for a successful connection before proceeding
2) Once established, open a subscription to the gossipsub topic $t$ by calling $S(t)$.
3) Participates in network consensus


### Genesis Round

The genesis round from which we will begin bridging drand. Authorities must wait until this pulse before publishing signatures. The value can only be set once by the root  user.


### Block Production

Block producers execute an *inherent* when authoring blocks, where they publish the aggregated signatures they observed during the block's lifetime to the runtime. The idea is that each block produced carries with it a mutation to runtime storage, where it inserts a new aggregated pulse which defines that latest randomness. This also verifies the signatures as described above, ensuring their correctness. This is composed of an *offchain* branch of logic and an *onchain* one.

1. During the lifetime of block $b$, let $\{(r_i, \sigma_i)\}_{i \in b_k}$ for some $b_k > 0$ be the pulses output from the gossipsub subscription $S(t)$. Here, $b_k$ is the number of pulses observed, which we refer to as its **height**. 

2. When a block author $A_i$ attempts to build block $b$, they first include the inherent call. Offchain, this aggregates the signatures to produce a single 48-byte asig that can be verified onchain: $asig = \sum_{i \in [b_k]} \sigma_i$. The inherent is then invoked with $(asig, b_k)$. 
    - If it is the genesis round, the block author also extracts the smallest round number (the genesis round: $r_G$) from the initial set of observed pulses and submits: $(asig, b_k, r_G)$.

3. The runtime constructs the message that it expects to have been signed by the associated asigs and uses it to verify them. That is, it computes $Q = \sum_{i \in [b_k]} Q_i$ and $b \leftarrow \mathcal{V}(\sigma, Q, pk)$. If $b = 1$ then the signature is valid, otherwise it is rejected.
    
    On the genesis submission we have no historic signatures committed to on-chain, so the extrinsic adds the pair $(Q, \sigma)$ to the runtime, along with the genesis round.
 
     On subsequent calls, it computes new round numbers and then appends the new signature and new round number to the previous ones stored on chain and verifies the entire construction. This constructs a sparse accumulator that allows us to prove that we have continuously observed pulse from a genesis to the latest round. To be explicit, if during block $b$ we observed $\{(r_i, \sigma_i)\}_{i \in [b_k]}$, then  on successful verification we store the pair $(Q = \sum_{b_k} H_1(r_i), \sigma = \sum_i \sigma_i)$. In the next block $b+1$, if we observed  $\{(r_i, \sigma_i)\}_{i \in [b_{k+1}]}$, then we first compute the pair $(Q' = \sum_{b_{k+1}} H_1(r_i), \sigma' = \sum \sigma_i)$, then aggregate it with the existing one to get $Q'' = Q + Q'$, $\sigma'' = \sigma + \sigma'$ and we verify this final aggregated value. This is our sparse accumulation that proves we have observed a continuous range of pulses from Drand.

### Pallet-Randomness-Beacon

The randomness beacon pallet contains the core logic for aggregating, verifying, and storing pulses from the randomness beacon. It stores an aggregated signature and aggregated public key that allows the runtime to efficiently verify that it has observed outputs from the randomness beacon for some sequential rounds, $r_1, r_2, ..., r_n$. In other words, the storage is designed to be minimalistic, essentially storing a commitment that we have observed and verified a set of sequential outputs, starting from some 'genesis' round to the latest one observed. 

#### Inherent Logic

1. read sigs (what if they are missing?)
2. aggregate sigs & extract 'start round'
3. call `write_pulses`


#### try_submit_asig 
The `write_pulses` extrinsic executes, where it:
1. aggregates pulses by computing $(Q, \sigma) = (\sum_{i \in [k]} Q_{ID_i}, \sum_{i \in [k]} \sigma_i)$
2. Verifies the aggregated signature by checking if $e(\sigma, g_2) == e(Q, pk)$
3. If not, the call fails. Otherwise, write the aggregated signature to storage.

The current block randomness is the hash of the aggregated signatures. That is, $rand(b) = Hash(\sigma_b || ctx)$, where $ctx$ can be any unbounded u8 slice and $\sigma_b$ is the aggregated signature of the sigs observed and written to the runtime when an authority proposed block b.

## Resources

1. https://drand.love/docs/cryptography
2. https://github.com/noislabs/drand-verify/blob/9a760444f1981604c9cbbfaf59b18df70a4168ad/src/verify.rs#L307
3. https://paritytech.github.io/polkadot-sdk/master/sc_consensus_aura/index.dhtml
4. https://github.com/libp2p/specs/blob/master/pubsub/gossipsub/README.md