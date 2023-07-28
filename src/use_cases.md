# Use Cases

Here we detail some use cases of EtF network at a high level. None of these currently exist and are only speculative, but this serves to showcase the networks capabilities.

## Atomic Asset Swap

Suppose there are two asset classes, A and B, and that Alice has `a` tokens of asset A and Bob has `b` tokens of asset B. Alice and Bob want to swap their assets, however, they do not trust each other. They both want to ensure that the asset swap only succeeds if both participants act honestly. We can accomplish this using the EtF network. First, recall that the network provides us the algorithms:

- \\(ct \leftarrow E(m, sl_k)\\) where \\(m \in \{0, 1\}^*\\) and \\(sl_k\\) is some future epoch
- \\(m \leftarrow D(ct, sk_k)\\) where ct is the ciphertext and \\(sk_k\\) is the slot secret

To perform the atomic asset swap, we’ll use a smart contract to act as intermediary holding of the assets. The protocol is as follows:

1. Alice deposits `a` into the contract. Bob deposits `b` into the contract.
2. Alice prepares a transaction that calls a function in the contract, `execute`, which sends her locked tokens to Bob. She signs the transactions, then encrypts it for a future epoch and publishes the encrypted transaction and signature in the contract. 
3. Bob does the same, submitting an encrypted transaction that sends his locked asset to Alice, encrypted for the same epoch as Alice’s transaction.
4. After the slot secret is revealed, both transactions can be decrypted and executed. Here, both transactions will call the contract `execute` function. The execute function checks if the other party provided a valid proof for their encrypted transaction, and if so, executes it. If the other party failed to submit a valid encrypted tx, then the swap fails and the offending party is slashed which the other receives all tokens back. 
