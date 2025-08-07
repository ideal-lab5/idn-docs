---
sidebar_position: 2
---

# Verifiable Randomness Beacons

A verifiable randomness beacon (VRB) is a protocol that outputs a hash-chain of publicly verifiable randomness. In many randomness beacon solutions, there is no way to trustlessly order outputs in an efficient way. Instead, outputs of randomness beacons are generally presented as a mixed bag of unsorted values with no inherent relation to each other (e.g. which one came first?). 

![](../../static/assets/blob.drawio.png)

IRBs output **pulses**, where each pulse is cryptographically linked to the one that came before it. By forming a hash-chain, we can easily ensure that each pulse carries with it a *partial causal ordering*, where we can prove that a pulse came before or after another one. We assume that each beacon outputs only a single pulse at a time and cannot compute future pulses in advance or delay previous pulses.

![](../../static/assets/hashchain.drawio.png)

Each beacon also has an associated, deterministic, well-defined identity function, $ID: \mathbb{N} \to \{0, 1\}^d$ for some $d > 0$, which outputs a unique and well-known identity for each pulse output by the beacon. This function is cryptographically secure and collision-resistant. The identity function allows for future beacon pulses to be easily subscribed to, as well as to act as a basis for performing *timelock encryption* later on. We say that the $n^{th}$ pulse $p_n$ output from a beacon $B$ was built on the identity $ID(n)$  


## Beacon Pulses

Each beacon outputs randomness in the form of a 'pulse'. A pulse is an opaque container of some type of verifiable randomness. In general, we can say that each pulse consists of a payload and a (zero knowledge) proof. We also assume that each pulse can be serialized to bytes, where each output of the beacon does not exceed some maximum size, as determined by the payload and proof types. 
d
``` json
"pulse": {
    "payload": Bytes,
    "proof": Bytes,
}
```

### Pulse Verification 


Each IRB has an associated verification function $V$ that operates on each pulse, allowing for it to be pubicly verified by any (untrusted) party who has the pulse data. That is, we define an opaque (and efficient) polynomial-time verification function as: $0/1 \leftarrow V(pp, payload, proof)$, where $pp$ is any *public parameters* required to verify the proof. It outputs $0$ if the pulse cannot be verified and $1$ otherwise. In practice, this function can take many different forms, however our beacon implementation relies on threshold BLS signatures as the payload and DLEQ proofs for verification. 
 

As mentioned above, pulses output from a beacon form a hash-chain, where each pulse is linked to a previous pulse with a cryptographic hash function, $H$. This concept is very similar to the core idea of a blockchain, though greatly simplified (moreso a cryptographically linked list).

``` json
{
    "header": {
        "identity": "", <--- The identity for which this pulse was created
        "next_identity": "", <--- pre-commitment value
        "parent_hash": Bytes, 
    },
    "body": {
        "pulse": Bytes 
    } 
}
```

Using this, we can efficiently verify if new pulses contain valid randomness as well as form a valid next element of the hash chain through the usage of the efficient verification function $V$ and known history of previous pulses. Given that a beacon has output pulses $\{p_1, ..., p_n\}$, we build a hash-chain $\{h_1, ..., h_n\}$, where each $h_1$ looks like the struct defined above, with each next pulse referencing the pulse prior to it. Using this history, when we receive a new pulse $h$ we:

1. Verify the pulse with the $V$ function. If it outputs $0$, reject the pulse, otherwise continue.
2. Verify the header by taking the hash of the previous pulse, $H(p_n)$, and check that it matches the value in the header of the new pulse $h$. 


