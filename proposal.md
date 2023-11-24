#### Dynamic Committe Proactive Secret Sharing

##### Background + Description

We may require that the network’s authority set (committee) be dynamic, where authority membership can change, or where authorities may become unreachable or be banned from the network. In the initial version of our consensus mechanism, all authorities are also IBE master key custodians, each having complete knowledge of the IBE master secret, making it very difficult to securely modify the authority set of the network without a large degree of centralization since we would need to distribute the master key. 

A verifiable secret sharing scheme (such as that used by [drand](https://drand.love/docs/cryptography/#verifiable-secret-sharing)) allows for secret shares to be publicly verified, however, it does not support a dynamic committee (drand has a static set of nodes, called the "League of Entropy"). In order to realize this, we need to distribute the secret key in a way that allows outgoing committees (validator sets) to produce shares for incoming committees. A [proactive secret sharing scheme](https://www.researchgate.net/profile/Amir-Herzberg/publication/221355399_Proactive_Secret_Sharing_Or_How_to_Cope_With_Perpetual_Leakage/links/02e7e52e0ecf4dbae1000000/Proactive-Secret-Sharing-Or-How-to-Cope-With-Perpetual-Leakage.pdf) allows for secret shares to be periodically refreshed, however, this still doesn’t meet the requirement, as it does not account for committee changes. Thus, we require a dynamic committee proactive secret sharing scheme. We intend to use the scheme detailed [here](https://eprint.iacr.org/2022/971.pdf), which relies on a bivariate polynomial in order to build new keys for the next committee. We will perform additional research into the feasibility of replacing the paillier encryption used in the paper above with el gamal encryption instead, as it is also a homomorphic encryption scheme but boasts somewhat better performance (see [here](https://arxiv.org/pdf/2202.02960.pdf)).

By properly handling the handoff of keys to upcoming committees, we can ensure that the membership of the validator set can be made dynamic while also preserving the security of the system.

##### Implementation

We will implement the dynamic committee proactive secret sharing (DPSS) mechanism using the Arkworks library, specifically making heavy usage of the arkworks/algebra crates.

In the blockchain runtime, we will use substrate’s [session management](https://paritytech.github.io/polkadot-sdk/master/pallet_session/trait.SessionManager.html) capabilities in order for validators to participate in the protocol, as well as to incentivize them to behave honestly. To be specific, we will use the session manager to integrate the ‘handoff’ between committees into consensus. Further, we will upgrade our node to run within a [TEE](https://polkadot.network/blog/trusted-execution-environments-and-the-polkadot-ecosystem) to ensure the security of the secret keys and their derivation.

Our network will then reward honest participants with our inflationary native token, else lock their account if they behave adversarially. For example, for failing to participate in the protocol (by issuing invalid shares). 

In addition, we will revisit the [timelock encryption](https://ideal-lab5.github.io/etf.html#timelock-encryption-with-etf-network) developed in the previous grant in order to account for the changes above. We can provide more mathematical detail on this upon request (whitepaper WIP). 

#### Delayed Transactions

There are several mechanisms in place in substrate/polkadot to delay transaction execution, for example with the [scheduler pallet](https://github.com/paritytech/substrate/blob/master/frame/scheduler/src/lib.rs), prototypes on a [delayed xcm queue](https://forum.polkadot.network/t/deferred-execution-of-xcmp-messages/2513), and of course the [time-delay proxy](https://wiki.polkadot.network/docs/learn-proxies#time-delayed-proxy), but each solution is vulnerable to front-running attacks, among other implications of ‘knowing the future’. In order to make this process more secure, we will use our timelock encryption scheme to seal transactions for the future, ensuring they can be placed onchain but kept secret until an appropriate time. That is, we require:

- transactions are encrypted with timelock encryption (for specific future slots)
- there is an automatic/implicit execution of transctions at pre-determined times

By delaying transactions for the future, we quickly run into an obstacle: nonces. Blockchains require a total ordering of all transactions from an account. Normally, transaction nonces are monotonically increasing sequences starting at 1 (or 0). Any origin that encrypts a transaction for a future block must specify a nonce in the transaction, say k for example. By committing to this nonce, the account must only use at most nonce k-1 before the future transaction is executed, otherwise the nonce will be invalid. This is quite a major limitation for an account, as it essentially means the account needs to, at some point, *not* be able to execute anything. A naive solution could look like using a chain of proxy accounts, essentially using one 'controller' account but separate nonces via proxy. 

In order to solve this problem, we will replace nonce validation completely through the usage of [Merkle clocks](https://research.protocol.ai/publications/merkle-crdts-merkle-dags-meet-crdts/psaras2020.pdf). A merkle clock is a type of logical clock based on Merkle DAGs, were each node in the "clock" contains some "event" data, a CID, and a reference to its direct descendents (a CID set). 

Essentially, each account will be able to submit 'delayed transactions' by first defining their 'schedule' as a merkle clock, which is then merged with other clocks to build a global *total* ordering of future events (transactions). By attaching auxiliary information (or weights) to each clock-node we can obtain a global total ordering of future events to be executed. That is, each event in the merkle clock corresponds to the some signed transaction. Validators will be responsible for decrypting, verifying, and applying these transactions. They can then prune the global merkle DAG to remove executed transactions (as they would normally do in a transaction pool).
##### Overview + Design

A [Merkle-clock DAG](https://research.protocol.ai/publications/merkle-crdts-merkle-dags-meet-crdts/psaras2020.pdf) is a Merkle DAG based logical clock to represent causality information between events in a distributed system. Each node in the DAG represents an event and allows for the construction of a grow-only set of events in a distributed system. It provides a mechanism for defining a partial ordering of all events defined in the clock, and by merging with other clocks, we can produce a partial ordering of their union. Here, partial ordering means we can tell if an event `A` happened before, after, or during another event `B`. We can easily introduce total ordering to the merkle clock by including extra information related to an external clock against which the logical clock 'ticks'. Watch this youtube video from protocol labs [at the 18 minute mark](https://youtu.be/ukfrmBVrpo8?t=1078) to get a better idea of how a Merkle clock works. In general, the entire video will provide a significant amount of context beyond what we can provide in the scope of this proposal.

##### Merkle Clock-Based Transaction Pool

A transaction pool, coupled with nonces, is used to define a total global ordering of events in the system by building a total global ordering of per-account transactions. By constructing a Merkle clock for a set of future transactions to be executed at specific future slots (in consensus), we can construct a "hash-based nonce". Or rather, we can **remove nonces completely** by constructing a total global ordering of transactions using a Merkle clock instead. The idea is that each node has a local Merkle clock which serves as a 'future transaction pool'. It can update its own Merkle clock by syncing with the Merkle clock of other participants in the network, in the same way that transactions are propogated through the network. Nodes in the clock contain timelocked transactions (weighted with a slot identity) which validators are responsible for decrypting when they calculate an IBE secret and apply the transaction to the state. This can be thought of as a **future transaction pool**. This Merkle DAG based approach still retains all the security guarantess of a traditional, numerical nonce: 

- replay protection: timelocked transactions are encrypted for specific blocks, which ensure that they cannot be decrypted by secrets leaked in other blocks. Transaction signatures rely on the CID of the transaction, which ensures that it is 'in the DAG' already.
- duplicate transaction submission: Duplicate transactions would have the same CID, and so we can easily validate if it is a duplicate

The general flow for producing a chain of transactions is then:

```mermaid
graph LR;
   A[prepare CALLS and encrypt for slots]-->B[construct Merkle clock nodes offchain];
   B-->C[Broadcast clock nodes and signature];
```

and when syncing clock nodes received from peers:

```mermaid
graph LR;
   A[recieve clock nodes from peers]-->B[verify clock nodes];
   B-->C[Accept and Merge into local Clock];
```

where clock nodes are considered valid as long as the AUX data does not invalidate the **strong clock property**. That is, 'later' events must have 'later' slots associated with them, more on that later.

There is additional computational load on validators and increased storage requirements. Instead of a storing a single number to represent an account nonce, each account requires a Merkle DAG. This contains the merkle clock nodes (described in detail below), which could quickly lead to large storage requirements for the entire chain. This can be minimized via on-chain economics, enforcing upper limits, and by pruning the clock nodes. We can also offload some storage to IPFS (the actual ciphertexts). We do not have a solution yet but we will consider these issues and keep them in mind as we develop the solution.

**Timelock Encryption** 

Briefly we want to discuss how the timelock encryption scheme works at a very high level. We can represent it with three algorithms:

1. $(SK, nonce) \leftarrow Setup(1^\lambda)$ which gives us a random 128-bit secret key and 12-bit nonce (for AES-GCM).
2. $(CT, capsule) \leftarrow Tlock.Enc(M, SK, nonce, t, \{ID_i\}_{i \in [n]})$ where $M \in \{0, 1\}^*$ is any message, and $(SK, nonce)$ are the output of the setup function. Each $ID_i$ is a unique slot identity and $t < n$ is some threshold of slot secrets required to recover $SK$.
3. $M \leftarrow Tlock.Dec(CT, capsule, nonce, \{sk_i\}_{i \in [n']})$ where $\{sk_i\}_{i \in [n']}$ consists of some threshold $t < n' \leq n$ secret keys leaked by the ETF consensus mechansim, without knowledge of $SK$.

When convenient, we will just use $CT$ to represent the output of the encryption function.

Now, we will describe the timelocked-transaction pool in detail.

**Setup**

Each event in our Merkle clock represents a timelocked call, where by call we mean in the same way as [substrate](https://docs.substrate.io/reference/transaction-format/) defines a call (CALL = (EXT, DATA)). The clock node payload contains a ciphertext, a call encrypted for some slot $sl_i$ ($CT \leftarrow TLock.Enc(tx, ID(sl_i))$). We will modify the merkle clock node slightly so that it includes AUX data (or a weight on the node), which we can use to build a global total ordering of events in the clock. Each node in our Merkle clock looks like:

$(CID_i, (CT_i, AUX), \mathcal{C}_{CID_i})$
 
 where $CT_i$ is the timelocked call, $CID_i$ is the CID of the payload, $\mathcal{C}_{CID_i}$ are its direct descendents' CIDs, and $AUX$ refers to a [slot identity](https://etf.idealabs.network/docs/ETF-extras/architecture#slot-identity) for which the ciphertext is encrypted. That is, $AUX = ID(sl_k)$ for some slot $sl_k$.

**Call Encryption and Clock Construction**

Assume that the chain has some set of extrinsics that can be called. Then we can represent a runtime call as $CALL = (EXT, DATA)$, where $EXT$ refers to the extrinsic and $DATA$ refers to the input parameters to the extrinsic. In this construction, we assume that each account has a local Merkle clock that they can sync with other nodes. They can broadcast signed messages to peers which contains updates to their local clock. This is done in much the same way as transactions would normally be broadcast between peers. When receiving new, valid clock nodes from peers, nodes 'sync' them to the future transaction pool by merging with their local clocks.

1. Construct a chain of calls that you want to execute: $\{CALL_i\}_{i \in [m]}$. Each call will be sealed for a future slot and encoded in a node in the Merkle clock.
2. Instantiate an empty Merkle clock.
3. For each $CALL_i$, determine some future slot $sl_i$ and encrypt the message for the corresponding slot identity, producing $CT_i \leftarrow Tlock.Enc(CALL_i, ID(sl_i))$.
4. Based on the ordering defined in the previous step, construct and add clock nodes to the merkle clock, with the first event referencing some already-known reference CID in the rest of the peers' clocks (any event in your clock that is before the one you want to submit but will not be executed/pruned yet).
5. Each $CALL_i$'s "nonce" is then the resulting CID of the merkle-clock node $(CID_i, (CT_i, ID(sl_i)), \mathcal{C}_i)$.
6. Produce a signature for each CALL/CID combination, $SIG_i = SIGN(H(CALL_i) \oplus CID_i)$. Signatures must be made available onchain prior to execution of any given call. They don't necessarily need to be known when submitting the Merkle clock nodes though. We will need to track these signatures in a separate data structure that reference the clock nodes, a mapping $CID \to SIG$
7. Finally broadcast the constructed Merkle clock and signatures.

When receiving new clock nodes from peers:
1. Verify that the received clock does not invalidate the existing clock. If signatures have been submitted for specific clock nodes, inserting any nodes prior would invalidate these signatures. We do not have an easy way to cancel delayed transactions once they have been added to the clock. This is a pretty big liminitation that we will solve in the future. 
2. Merge the clocks and verify the CID matches an expected one (broadcast along with clock nodes just received)

It should be clear that alongside the merkle clock we also require a store of signatures for the transactions (i.e. which are valid on the decrypted ciphertexts). This would look like a storage map to associate: [CID -> SIGNATURE]

Here is a visual example of what the merkle clock would look like for three transactions built on top of a 'genesis' event.

```mermaid
graph TD;
   A[CID: QmA..., payload: null, 0, C: null]-->B[CID: QmB..., payload: CT_B, slot_b, C: QmA...];
   B-->C[CID: QmC..., payload: CT_C, slot_c, C: QmA...];
   C-->D[CID: QmD..., payload: CT_D, slot_d, C: QmB..., QmC...];
```

Here, some account, say Alice, has constructed a Merkle clock for her delayed transactions, where the payload of each clock node contains both the encrypted CALL alongside the slot in blockchain consensus when that call can be decrypted.

**Merging Clocks**

When there are several clocks, they can be merged to form a global, partially ordered Merkle Clock. By using the AUX data (slot identities), we can induce a global total ordering on all events. We won't define the merging algorithm in the scope of this proposal, however, we will visually elaborate the idea:

note: the colors in this diagram work best in dark mode.

```mermaid
graph TD;
   A[CID: QmA..., payload: null, 0, C: null]-->B[CID: QmB..., payload: CT_B, slot_b, C: QmA...];
   A--->E[CID: QmE..., payload: CT_E, slot_c, C: QmA...];
   A--->C[CID: QmC..., payload: CT_C, slot_c, C: QmA...];
   C-->D[CID: QmD..., payload: CT_D, slot_d, C: QmB..., QmC...];

   style B fill:#668ba0;
   style C fill:#a06666;
   style D fill:#a06666;
   style E fill:#727272;
```

Clocks can only be merged if they are valid. That is, for any clock nodes, we must validate the AUX data associated with the node to ensure that 'later events' have slots that INCREASE within the AUX data. For example, look at the image above. There are three clocks being merged, the blue clock, $B = (n_b)$, the green one, $G = (n_e)$, and the red one $R = (n_c, n_d)$. Since each clock node in each clock is valid, where the AUX data increases with each event in the clock, the three clocks can be merged. It is then easy to see how this defines a global total ordering. The Merkle clock structure provides a partial order, and then by inspecting AUX data, we arrive at a total order, which is: $A => B => {E, C} => D$, where the ordering of $E$ and $C$ is somewhat arbitrary and left to the discretion of individual block producers.

If we replaced the red clock in the diagram with nodes where the slots are not increasing, then we would NOT merge that clock. The clock below would be invalid:

```mermaid
graph TD;
   A[CID: QmA..., payload: null, 0, C: null]-->C[CID: QmC..., payload: CT_C, slot_d, C: QmA...];
   C-->D[CID: QmD..., payload: CT_D, slot_c, C: QmC...];
```

**Future Transaction Pool Validation and Execution**

Note: We know that this solution has clear limits to scalability. We do not plan to address that in the scope of this grant (and are open to suggestions).

Validator nodes are responsible for decrypting ciphertexts and executing transactions when they author blocks. They do this by first calculating an IBE secret (and DLEQ proof, as in the ETF consensus mechanism) and subsequently use it to decrypt ciphertexts. You can read more on the proof-of-extract mechanism [here](https://etf.idealabs.network/docs/ETF-extras/architecture#consensus-and-encryption-to-the-future). Instead of fetching the highest-priority transactions from the transation pool, validators use their latest known Merkle clock to fetch transactions that are weighted with the current slot identity. Once decrypted, transaction validation logic can continue unchanged, but we do not perform nonce validation and we verify the signature using the CID from the Merkle clock node.

```mermaid
graph LR
   A[IBE.Extract & DLEQ.Prove] --> B[Get ciphertexts from Merkle clock];
   B-->C[Decrypt and Validate calls];
   C-->D[Build, sign, and broadcast the block];
```

The block contains the DLEQ proof in the block header along with a value, $r$, per transaction. This value is calculated when the ciphertext is decrypted by the validator and allows for the ciphertext to be re-encrypted in the same way. Using these value, a block importer can verify the transactions against the merkle clock. The transactions consist of unsealed timelocked transactions. After submitting the transactions, the validator prunes its state (but does not broadcast this). 

When a block is imported, a block importer verifies the DLEQ proof and the signature on the block (note: we could potentially only require a DLEQ proof). Then, they validate the transactions as usual, excluding nonce validation. Instead, validation requires that the transactions be re-encrypted and the Merkle clock be rebuilt, after which the root CID can be calculated and compared.

That is, upon receiving a block:

``` mermaid
graph LR
   A[validate the DLEQ proof] --> B[validate transactions w/o nonce];
   B-->C[Reencrypt transactions and rebuild clock state];
   C-->D[verify root CID];
```

It could be better if we has some type of Identity based homomporphic encryption, where we could perform some calculation on the sealed call data to check if the decrypted transactions are valid without requiring re-encryption of the transactions.

##### Implementation Details

There are three large pieces of the implementation:

1. Constructing, Scheduling, Encrypting, and submitting clock nodes: 
   - This includes constructing a Merkle clock offchain and then submitting it onchain. 
   - We will use our [etf.js](https://github.com/ideal-lab5/etf.js) library as a basis for constructing clock nodes offchain, where they construct transactions, encrypt them, then define their clock.
   - This would also include the introduction of a txwrapper for constructing custom calls to the network via polkadotjs.
   
2. The Future Transaction Pool: 
   - This is the implementation of a transaction pool based on Merkle clocks. 
   - The existing transaction pool implementation in substrate will serve as the basis for this work. In fact, substrate's tx pool implementation contains `requires/provides` fields that allow for transactions to be organized into a DAG. We intend to leverage this field in order to build the Merkle Clock. 
   - Each transaction submission contains a tuple, $(CT, deadline ,requires, provides)$ where $CT$ is the ciphertext, $deadline$ is the slot when it should be decrypted, $requires$ is the CID-set $\mathcal{C}$ of direct descendents, and $provides$ is the CID of the clock node itself.
   - We will modify what a "transaction" contains (the struct), as it will no longer contain an `Extrinsic` (a ciphertext instead, so essentially just a blob of data). This, along with an additional field to represent the 'weight' on each clock node, we can quite feasibly implement this.
  
3. Transaction Execution and Clock Pruning:
   - this is mostly validator-only functionality, including block production and block import as outlined above
   - we will build this on top of our existing consensus modules, etf-aura
   - pruning will occur in much the same way as it would normally, but subject to extra checks (to account for change in ordering)
 
#### Delayed Transaction Manager

The delayed transaction manager is a set of tools and a user interface that enables users to:

- prepare and submit delayed transactions
- inspect the current chain state
- monitor delayed transaction status

Much of this functionality, such as the block explorer and preparing calls, will behave similarly to polkadotjs 'under the hood'. We also will investigate using some notification system to provide alerts on execution of delayed transactions. This will serve as a fundamental piece that allows end-users to interact with the system and prepare delayed transactions. 

There are two major components, the `scheduler` and the `explorer`.

**Scheduler UI**
The scheduler module will allow users to construct transactions and chains of transactions through a visual interface. Users would be able to schedule transactions to be executed in the future, either independently or as part of a chain of transactions. A chain of transactions is a valid merkle clock that other nodes agree to merge (i.e. valid calls chained together with provides/requires). It will incorporate tools to:

- Construct, sign, encrypt, and schedule transactions for future blocks
- Define chains of calls/transactions
- display fee estimation for future transactions

**Explorer UI**
The explorer module will allow visualization of scheduled transactions and provide options to get details during their lifecycle. It will incorporate tools to:
- Query/Search scheduled transactions (past and future).
- View detailed information on scheduled transactions
- Monitor the execution of scheduled transactions, and chains of transactions through a visual interface.
- Stretch: Subscribe to get notifications about status changes on specific scheduled transactions.

Below, we present the timelock auction version 2:

### Timelock Auction Version 2: using timelocked transactions

In our previous grant we developed a timelock auction (https://auction.idealabs.network) which uses timelock encryption to seal bids for a future deadline. After the auction's deadline, the contract allows a ‘complete’ function to be called, which requires that ciphertexts (sealed bids) be decrypted offchain, then supplied to the contract (where the data is hashed and verified against original commitments). This is not ideal, as it first requires offchain computation in order to complete the auction, and secondly it either requires  that each participant calls the complete function, or else that they have a degree of trust that another participant called it with their unsealed bid. For more detailed information, see the docs [here](https://ideal-lab5.github.io/timelock_auction.html).

By introducing delayed transactions to the auction, we can make the process require less trust and to be non-interactive. By using delayed transactions as described above, we no longer need to perform the commit-reveal style interaction that is currently in place. Instead, participants only need to schedule a single transaction onchain and wait until the scheduled transactions are executed (at the ‘deadline’ block), after which payouts can immediately be claimed from the contract with no specific input from any other participants. That is, by performing the IBE decryption in the on_initilaize hook of the scheduler pallet, we no longer require the COMPLETE function that exists in version one of the contract.

To elaborate, the auction contract we built has two functions, BID and COMPLETE, as mentioned above. In version 1 of the contract, BID accepts a timelocked ‘bid’, which should decrypt to a bid amount, whereas COMPLETE expects the revealed, decrypted value (which it verifies by checking the hash). Above the auction is an orchestrator contract, which proxies calls to the auction (so all interaction is actually through the orchestrator). After an auction is finished, the orchestrator allows a CLAIM function to be called to claim a payout. To make this non-interactive with delayed transactions, this would look like preparing a timelocked transaction to call the BID function of the contract, passing a bid amount b. That is, an account Alice prepares a call like CALL = (contract.call, BID(b)), then encrypts it for a future slot and broadcasts their merkle clock node. After the transaction is executed, the CLAIM function of the orchestrator can be invoked, with no need to “Complete” the auction. That is, we've gone from [place bid -> decrypt bids after deadline -> submit bids -> complete auction -> claim payout] to a more streamlined flow: [place bid -> claim payout].