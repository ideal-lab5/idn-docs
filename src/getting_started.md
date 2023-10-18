# Getting Started

Since Etf Network is a substrate based blockchain, in general all commands that work with the default CLI implemented in substrate are compatible with this blockchain (i.e. for keygen). 

## Setup

### Installation
To build the blockchain locally:
``` bash
# clone substrate and checkout the etf branch
git clone git@github.com:ideal-lab5/substrate.git
cd substrate
git checkout etf
# nightly build
cargo +nightly build --release
```

### Run

**From Sources**
As previously stated, all default substrate commands will work. For example, to run the blockchain in dev mode as Alice, use:

``` bash
./target/release/node-template --tmp --dev --alice
```

**From Docker**

The latest docker image can be found [here](https://hub.docker.com/r/ideallabs/etf)

``` bash
# pull the latest image
docker pull ideallabs/etf
# run the image
# the image accepts all substrate commands/flags
docker run -p 9944:9944 -it --rm --name etf-node-0 ideallabs/etf --unsafe-rpc-external --validator --dev --tmp
```

The raw chainspec for our testnet can be found [here](https://raw.githubusercontent.com/ideal-lab5/substrate/etf/etfTestSpecRaw.json). You will need to add the `--chain etfSpecTestRaw.json` when running your node to connect to the testnet (contact us if any issues).

## Testing

### unit tests
`cargo +nightly test`

### Benchmarks

First navigate to `/bin/node-template/node/` and build it with `cargo +nightly build --profile=production --features runtime-benchmarks`

run benchmark tests with
` cargo test --package pallet-etf --features runtime-benchmarks`

Once built, generate weights against the compiled runtime with:

``` bash
# list all benchmarks
./target/production/node-template benchmark pallet --chain dev --pallet "*" --extrinsic "*" --repeat 0
# benchmark the etf pallet
./target/production/node-template benchmark pallet \
    --chain dev \
    --wasm-execution=compiled \
    --pallet pallet_etf \
    --extrinsic "*" \
    --steps 50 \
    --repeat 20 \
    --output bin/node-template/pallets/etf/src/weight.rs
```