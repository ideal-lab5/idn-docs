# Encryption to the Future (the math)

The EtF network uses a slot-based consensus mechanism (Aura) and identity based encryption methods to associate an identity with each slot. The initial version of the network uses a simple approach for deriving keys, but which requires a significant amount of trust to be placed in each authority. Each authority is an IBE master secret key custodian and is made responsible for deriving and leaking IBE secret keys within each slot where they're an author. By encrypting to the public key associated with each slot, messages can be encrypted so that the decryption key is only made public when a block is authored in that slot. On top of this, we can enable timelock encryption.

## How it works

The encryption to the future (EtF) scheme consists of two PPT algorithms, \\((Enc, Dec)\\), such that:

- \\( ct \leftarrow Enc(m, sl_k) \\) for some future slot \\(sl_k\\) and a message \\(m \in \{0, 1\}^*\\). It outputs the ciphertext \\(ct\\).
- \\(m' \leftarrow Dec(ct, sk_{S_k})\\) where \\(sk_{S_k}\\) is the secret key (as in the derive phase of the IBE scheme) leaked in the block authored in slot \\(sl_k\\).

By using IBE and DLEQ proofs, slot winners calculate a proof of knowledge of the master secret along with the derived slot secret, which they include in each block header. Block importers validate the DLEQ proof when importing blocks, ensuring that secrets are only included when they are provably valid. 

### Identity Based Encryption

EtF uses a flavor of the [Boneh-Franklin IBE scheme](https://crypto.stanford.edu/~dabo/papers/bfibe.pdf). In brief, identity based encryption is a scheme were a message can be encrypted for an arbitrary string, rather than some specific public key. For example, a message could be encrypted for "bob@encryptme.com" so that only the owner of the identity "bob@encryptme.com" is able to decrypt the message. The BF-IBE consists of four PPT algorithms (Setup, Extract, Encrypt, Decrypt). In brief, these can be defined as:

- \\(Setup(1^\lambda) \to (pp, mk)\\) where \\(\lambda\\) is the security parameter, \\(pp\\) is the output (system) params and \\(mk\\) is the master key.
- \\(Extract(mk, ID) \to sk_{ID}\\) outputs the private key for \\(ID\\).
- \\(Encrypt(pp, ID, m) \to ct\\) outputs the ciphertext \\(ct\\) for any message \\(m \in \{0, 1\}^*\\).
- \\(Decrypt(sk_{ID}, ct) \to m\\) outputs the decrytped message \\(m\\)

### DLEQ Proofs

EtF uses DLEQ proofs to verify the correctness of slot secrets without exposing the master secret for the IBE. In brief, the DLEQ proof allows a prover to construct a proof that two group elements were calculated from the same secret (e.g. xH and xG were calculated from the same x) without exposing the secret. Our scheme uses DLEQ proofs to leak an IBE slot secret \\(d = sQ\\) without exposing the master key, s.

The prover and verifier agree on two group generators, G and H and makes xG and xH publicly known. The goal is for the prover to demonstrate they know xG and xH were derived from the same x.

First, the prover:
1. chooses a random \\(r \in Z_p\\) and calculates \\(R1 = rG, R2 = rH\\).
2. calculates the challenge value with a hash function \\(c = H(R1, R2, xG, xH)\\)
3. calculates the proof of knowledge \\(s = r + c* x\\)
4. shares \\((R1, R2, s)\\)

With the agreed upon public parameters \\(G, H\\) and the proof \\((R1, R2, s)\\), a verifier can be convinced that the prover knows \\(x\\) without revealing it. The verifier:
1. calculates the challenge value by hashing \\(c = H(R1, R2, xG, xH)\\)
2. checks if \\(c(xG) - sG == R1 && c(xH) - sH == R2\\). If both equalities are true, the proof is valid. otherwise, it is invalid.
