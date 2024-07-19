---
sidebar_position: 3
---

# Entropy Mesh

The *entropy mesh* is a sharded data structure that aggregates pulses of any number of [IRBs](./interoperable_randomness_beacons.md) to aggregate and re-randomize each other. It enables the synthesis of many independent beacon implementations or protocols, allowing for use-case specific beacons to be aggregated (and thus re-randomize each other).

It is a Merkle clock managed and secured by the Ideal Network.

- allows for use-case specific beacons following their own protocols
- enables tight time bounds and data integrity for beacons

## CRDTs and Merkle Clocks 

The Entropy Mesh is a Merkle clock, a kind of CRDT (conflict-free replicated data type) that uses a Merkle DAG structure. It allows us to:
- construct an auditable and verifiable time-based record of pulses submitted by various IRBs
- compare pulses across IRBs, allowing for protocols that use various sources of randomness
- allows for the computation of a global random value (the root node of the DAG) that can be used for real-time randomness in web3 systems.    