# ETF Beacon Protocol

## Background

### Computational Reference Clocks

When describing the protocol, we assume the existence of a computational reference clock (CRC). All participants are observers of this clock and the protocol operates each time the CRC 'ticks'. To be more precise, we define a CRC as:

- TODO

### Aggregatable BLS sigs

Efficient Aggregatable BLS Signatures with Chaum-Pedersen Proofs 

The scheme consis of the following tuple of algorithms: $(AS.Setup, AS.GenerateKeypair, AS.VerifyPoP, AS.Sign, AS.AggregateKeys, AS.AggregateSignatures, AS.Verify)$"

- $pp \xleftarrow[]{} AS.Setup(\lambda)$
- $((pk, \pi_{PoP}), sk) \xleftarrow[]{} AS.GenerateKeypair(pp)$
- $0/1 \xleftarrow[]{} AS.VerifyPoP(pp, pk, \pi_{PoP})$
- $\sigma \xleftarrow[]{} AS.Sign(pp, sk, m)$
- $apk \xleftarrow[]{} AS.AggregateKeys(pp, \{pk_i\}_{i \in [n]})$
- $asig \xleftarrow[]{} AS.AggregateSignatures(pp, \{\sigma_i\}_{i \in [n]})$
- $0/1 \xleftarrow[]{} AS.Verify(pp, apk, m, asig)$

## The Protocol

Let $P = \{P_i\}_{i \in [n]}$ be some participants in the protocol.