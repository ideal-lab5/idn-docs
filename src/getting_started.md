# Getting Started

EtF Network is a substrate based blockchain. In general, all commands that work with the default CLI implemented in substrate are compatible with this blockchain.

## Setup

### Installation
To build the blockchain locally:
``` bash
# clone substrate and checkout milestone1 branch
git clone git@github.com:ideal-lab5/substrate.git
cd substrate
git checkout milestone1
# nightly build
cargo +nightly build --release
```

(Optional) Setup the [Etf monitor tool](./etf_monitor.md)

### Run

**From Sources**
As previously stated, all default substrate commands will work. For example, to run the blockchain in dev mode as Alice, use:

``` bash
./target/release/node-template --tmp --dev --alice
```

**From Docker**

The latest docker image can be found [here](https://hub.docker.com/r/ideallabs/etf)

``` bash
docker pull ideallabs/etf
docker run <image>
```

## Testing

### unit tests
`cargo +nightly test`

### Benchmarks

first build with `cargo +nightly build --profile=production --features runtime-benchmarks`

run benchmark tests with
` cargo test --package pallet-etf --features runtime-benchmarks`

Once built, run benchmarks against compiled runtime with:

list available benchmarks:
./target/production/node-template benchmark pallet --chain dev --pallet "*" --extrinsic "*" --repeat 0

./target/production/node-template benchmark pallet \
    --chain dev \
    --wasm-execution=compiled \
    --pallet pallet_etf \
    --extrinsic "*" \
    --steps 50 \
    --repeat 20 \
    --output bin/node-template/pallets/etf/src/weight.rs