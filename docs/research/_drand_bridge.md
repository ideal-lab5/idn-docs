# Drand Bridge Pallet

The drand bridge pallet allows Substrate based chains to consume randomness from drand's Quicknet. The pallet implement an offchain worker to read pulses from drand's Quicknet API and submit it to an extrinsic. 

## How it Works

Drand's quicknet periodically outputs pulses of verifiable randomness every 3 seconds. There are various API's which provide access to the beacon, with this pallet simply using the main api.drand.sh URI. This pallet runs an offchain worker, which executes each time a node imports a new (not finalized) block.

### Assumption and Limitations

1. in this initial version of the pallet we assume that the implementer is using a forkless block authoring mechanism, Isuch as Aura. Since we just use an offchain worker to read from drand, forks in the chain would result in divergent chains of randomness, which we must avoid.

2. Currently OCWs are at the will of the client’s “major sync oracle”, which means OCWs will not execute if the node is undergoing a “major sync” event.

3. It only supports drand’s quicknet, and so there is some trust placed in drand that they will retain liveness and that the league of entropy is not compromised.

Note that the IDN beacon (link here) does **not** succumb to these same limitations. 

### Reading Pulses

The pallet attempts to read a fresh pulse of randomness from drand with each new block that is imported. We provide a 2 second window in which the OCW awaits a response from drand (this time must be less than the time allotted for block authorship). The OCW attempts to deserialize the response body to a struct. If valid, an signed transaction is constructed with the new struct being the payload. The runtime then verifies the new pulse before adding it to storage.

![](../../static/assets/drand_ocw.png)

### Writing Pulses

Pulses are stored in a storage map.
Verifying Pulses

> Drand's Quicknet functions as a distributed, MPC protocol that produces and gossips threshold BLS signatures. In this flavor of drand, short signatures are used where the signature is in the G 1 group and public keys are in G 2 .

To verify pulses from drand, we check the equality of the pairings: $e ( − s i g , g 2 ) == e ( m , p k )$ where $m = H ( messsage = Sha256(round))$ , $sig$ is the round signature, $g_2$ is a generator of the $\mathbb{G}_2$ group, and $pk$ is the public key associated with the beacon.

### Example

See the example node in the [pallet-drand](https://github.com/ideal-lab5/idn-sdk) repo.