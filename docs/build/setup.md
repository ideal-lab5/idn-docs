---
sidebar_position: 1
---

# Getting Started

This guide walks you through how to run a local IDN node for development and testing. Specifically, we detail how to run the `etf` solochain version of the network. 

## Setup

### Installation

To build the blockchain locally:
``` sh
# clone substrate and checkout the etf branch
git clone git@github.com:ideal-lab5/etf.git
cd etf
cargo build --release
```

### Run

**From Sources**
As previously stated, all default substrate commands will work. For example, to run the blockchain in dev mode as Alice, use:

``` sh
./target/release/node --tmp --dev --alice
```

**From Docker**

The latest docker image can be found [here](https://hub.docker.com/r/ideallabs/etf)

``` sh
# pull the latest image
docker pull ideallabs/etf
# run the image
# the image accepts all substrate commands/flags
docker run -p 9944:9944 -it --rm --name etf-node-0 ideallabs/etf --unsafe-rpc-external --validator --dev --tmp
```

## Chainspec

To connect to our development network, use the raw chainspec for our testnet found [here](https://raw.githubusercontent.com/ideal-lab5/etf/main/etfDevSpecRaw.json). You will need to add the `--chain etfDevSpecRaw.json` when running your node to connect to the testnet. 

``` sh
wget https://raw.githubusercontent.com/ideal-lab5/etf/main/etfDevSpecRaw.json
```

## Faucet

Head to our [discord faucet channel](https://discord.gg/Txew8BzAfb) to request 100 tokens every 12 hours! Send tokens to your account address with the message `@etf-faucet-bot !drip <your address>`.

## Testing

### unit tests
`cargo test`

### Benchmarks

Build the project with: `cargo build --profile=production --features runtime-benchmarks`

Then run benchmark tests with:
` cargo test --package pallet-etf --features runtime-benchmarks`

Once built, generate weights against the compiled runtime with:

``` bash
# list all benchmarks
./target/production/node benchmark pallet --chain dev --pallet "*" --extrinsic "*" --repeat 0
# benchmark the etf pallet
./target/production/node benchmark pallet \
    --chain dev \
    --wasm-execution=compiled \
    --pallet pallet_etf \
    --extrinsic "*" \
    --steps 50 \
    --repeat 20 \
    --output /pallets/etf/src/weight.rs
```