<!-- ---
sidebar_position: 1
---

# Timelock Encryption

The ETF consensus mechanism enables timelock encryption. In this section we discuss the technical details and implementation of timelock encryption in the ETF network.

Timelock encryption allows messages to be encrypted for future blocks in the ETF consensus mechanism. The secret leaked in those slots can be used to recover decryption keys to unseal the data. In other terms, it lets you send messages **'to the future'**.

## Usage

Timelock encryption can be used in the browser with the [etf.js](https://github.com/ideal-lab5/etf.js) library.

```javascript
let etf = new Etf('ws://localhost:9944')
await etf.init()
let message = "encrypt me!"
let threshold = 2
let blocks = [151, 152, 159]
let seed = "random-seed"
let out = etf.encrypt(message, threshold, slotSchedule, seed)
```

The `encrypt` function returns $((ciphertext, nonce), capsule)$ where the ciphertext is the AES-GCM ciphertext of the message, the nonce is the random nonce generated, and the capsule is the IBE ciphertext(s).

Ciphertexts can be recovered when slot secrets are known. This can be done very easily with etf.js:

```javascript
let m = await etf.decrypt(ciphertext, nonce, capsule, blockNumbers)
let message = String.fromCharCode(...m)
```

## Overview

The timelock encryption scheme is a hybrid encryption scheme using both [AES-GCM](https://csrc.nist.rip/groups/ST/toolkit/BCM/documents/proposedmodes/gcm/gcm-spec.pdf) with [identity based encryption](#identity-based-encryption). This allows for any length messages to be encrypted with 32-bit secret keys. 

The encryption to the future (EtF) scheme consists of two PPT algorithms, $(Enc, Dec)$, such that:

- $ (f(x), nonce) \leftarrow Setup(k, n) $ for some $k < n$, and where $f(x)$ is an $n$ degree polynomial. the nonce is a 12 bit nonce for AES.
- $ (ct, capsule) \leftarrow Enc(m, {id_1, ..., id_m}) $ for some slot identities for slots $sl_1, ..., sl_m$ and a message $m \in \{0, 1\}^*$. It outputs the AES ciphertext $ct$ and IBE ciphertexts $ capsule = { ct_i = IBE.Encrypt(pp, id_i, f(i)) } $ where $pp$ is the IBE public parameter.
- $m' \leftarrow Dec((ct, capsule), {sk_1, ..., sk_m})$ where $sk_i$ is the secret key leaked in the block authored in the slot with id $id_i$.

It works by first using the polynomial $f(x)$ to generate shares, $f(1), ..., f(n)$ for $n \geq 1$, then encrypting each share for a future slot (or single future slot). The secret key $f(0)$ can be used in the AES-GCM encryption algorithm as the secret key. Thus, a message of any length $m$ can be encrypted under AES-GCM using the secret key. The secret key can be recovered by extracting slot secrets 

![2](../../static/assets/aes_etf.png)

## Prerequisites

### Identity Based Encryption

We use the BF-IBE "FullIdent" [ref] scheme to encrypt messages for future time intervals. FullIdent is IND-ID-CCA secure. In FullIdent, public parameters are stored in $\mathbb{G}_1$, and the scheme uses type 1 pairings. We will instead use type 3 pairings, so our public parameters are in $\mathbb{G}_2$ instead.

**Setup**

Let $e: \mathbb{G}_1 \times \mathbb{G}_2 \to \mathbb{G}_2$ be a bilinear map, $H_1: \{0, 1\}^* \to \mathbb{G}_1$ a hash-to-G1 function, $H_2: \mathbb{G}_2 \to \{0, 1\}^n$ for some $n$, $H_3: \{0, 1\}^n \times \{0, 1\}^n \to \mathbb{Z}_q$, and a cryptographic hash function $H_4: \{0, 1\}^n \to \{0, 1\}^n$. Choose a random $s \xleftarrow{R} \mathbb{Z}_p$ and a generator $P \xleftarrow{R} \mathbb{G}_1$. Then, broadcast the value $P_{pub} = sP$.

**Extract**

Compute the IBE secret for an identity $ID$ with $d_{ID} = sQ_{ID}$ where $Q_{ID} = H_1(ID)$

**Encryption**

Let $M \in \{0, 1\}^*$ be the message and $t > 0$ be some future time slot in the CRC $\mathcal{C}$ for which we want to encrypt a message and assume it has a unique id, $ID_t$.

1. Compute $Q_{ID_t} = H_1(ID_t) \in \mathbb{G}_1$
2. Choose a random $\sigma \in \{0, 1\}^n$
3. set $r = H_4(\sigma, M)$
4. Calculate the ciphertext $C = \left<U, V, W\right> = \left< rP, \sigma \oplus H_2(g^r_{ID}), M \oplus H_4(\sigma) \right>$


where $g_{ID} = e(Q_{ID}, P_{pub}) \in \mathbb{G}_2$

**Decryption**

For a ciphertext $C = \left <U, V, W\right >$ encrypted using the time slot $t$. Then $C$ can be decrypted with the private key $d_{ID_t} = s Q_{ID_t} \in \mathbb{G}_1$, where $s$ is the IBE master secret, as such:

1. Compute $V \oplus H_2(e(d_{ID_t}, U)) = \sigma$
2. Compute $W \oplus H_4(\sigma) = M$
3. Set $r = H_3(\sigma, M)$. Check if $U = rP$. If not, reject the ciphertext.
4. Output $M$ as the decryption of $C$

This works since:

$e(d_{ID}, U) = e(sQ_{ID}, rP) = e(Q_{ID}, P)^{sr} = e(Q_{ID}, P_{pub})^r = g_{ID}^r$


### DLEQ Proofs

EtF uses DLEQ proofs to verify the correctness of slot secrets without exposing the master secret for the IBE. In brief, the DLEQ proof allows a prover to construct a proof that two group elements were calculated from the same secret (e.g. xH and xG were calculated from the same x) without exposing the secret. Our scheme uses DLEQ proofs to leak an IBE slot secret $d = sQ$ without exposing the master key, s.

The prover and verifier agree on two group generators, G and H and makes xG and xH publicly known. The goal is for the prover to demonstrate they know xG and xH were derived from the same x.

First, the prover:
1. chooses a random $r \in Z_p$ and calculates $R1 = rG, R2 = rH$.
2. calculates the challenge value with a hash function $c = H(R1, R2, xG, xH)$
3. calculates the proof of knowledge $s = r + c* x$
4. shares $(R1, R2, s)$

With the agreed upon public parameters $G, H$ and the proof $(R1, R2, s)$, a verifier can be convinced that the prover knows $x$ without revealing it. The verifier:
1. calculates the challenge value by hashing $c = H(R1, R2, xG, xH)$
2. checks if $c(xG) - sG == R1$ and $c(xH) - sH == R2$. If both equalities are true, the proof is valid. otherwise, it is invalid.

## Timelock Encryption

$\textbf{Encryption}$

1. Choose some $n$ and $I \subset \mathbb{N}$ with $|I| = n$.
2. Choose a positive threshold $t \leq n$ and generate a t-degree polynomial $f(x) = \sum_{i = 0}^t a_ix^i$ over some finite field $\mathbb{F}$.
3. Calculate shares $f(i) = u_i \forall i \in [k]$ and encrypt each share $u_i$ for the corresponding slot $sl_i$ using IBE, calculating $ct_i \leftarrow FullIdent.Encrypt(u_i, ID_i)$.
4. Choose a random nonce and let $f(0) = x$ be the AES secret key, which can then be used to encrypt the message $ct \leftarrow AES.Encrypt(m, nonce, x)$ for some valid nonce.
5. The ciphertext is $((ct, nonce), \{ct_i\}_{i \in [k]})$

$\textbf{Decryption}$

A ciphertext $((ct, nonce), \{ct_i\}i \in [k])$, encrypted for some $I \subset \mathbb{N}$, can be decrypted by first using extracting the secret keys $\{sk_i\}_{i \in \mathbb{N}}$ and performing Lagrange interpolation to recover the AES master secret, and then using that to decrypt the message. Decryption is as follows:

1. Recover at least $k+1$ of the IBE secrets $sk_i$ for each $i \in I$
2. Decrypt at least $k+1$ shares $m_i \leftarrow FullIdent.Decrypt(ct_i, sk_i)$
3. Use lagrange interpolation on the decrypted shares to recover the polynomial $f(x)$ and evaluate it at $0$ to recover the AES secret $f(0) =: s$.
4. Decrypt the ciphertext with the recovered secret $m \leftarrow AES.Decrypt(ct, nonce, s)$ -->