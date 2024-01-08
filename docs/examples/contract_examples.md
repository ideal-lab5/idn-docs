---
sidebar_position: 3
---

# Contract Examples

This is a collection of examples of smart contracts built on the ETF network. You can check them all out on github [here](https://github.com/ideal-lab5/contracts/tree/main/examples).

- [BitRoulette](https://github.com/ideal-lab5/contracts/tree/main/examples/bit-roulette)
  Bit roulette is a basic example that demonstrates:
    1. usage of onchain randomness
    2. using delayed transactions to orchestrate simultaneous actions by all participants (i.e. they all have to use the same randomness)
- [onchain randomness for randomly seeded world generation](https://github.com/ideal-lab5/contracts/tree/main/examples/world-registry)
    This is a basic of example to demonstrate how the onchain randomness can be used. Here, we let users provide an input seed which is xor'd with the latest block randomness to generate a new random seed. This seed is stored as the identity of a `world`, which can be used, for example, as input to a procedural generation algorithm, such as Perlin noise, to generate a game world from the owned, veriable, random seed.
- [Block Battalion](https://github.com/ideal-lab5/block-battalion/tree/main/contracts) 
    Block battalion is a simple game built around bit roulette as a core game mechanic. It demonstrates how to construct a **decentralized game event clock** to orchestrate player actions. In bit roulette, all players attempt to harvest resources by guessing the parity of the same slot secret (via delayed transactions). 