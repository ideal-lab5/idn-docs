---
sidebar_position:  9
title: VRaaS Price Simulator
---
import PricingSimulator from '@site/src/components/PriceSim';

## VRaaS Pricing Simulator

<h2>📢 These prices are an estimate only.</h2>

For actual pricing you should call the `quote_subscription` extrinsic from the IDN. If you are on a parachain or contract that has already [integrated with the IDN](./guides_and_tutorials/quickstart.md), call the `request_quote` extrinsic from your chain.

#### How it Works

When using the simulator, the *frequency* is the number of blocks that you **do not** receive anything. For example, a frequency of `0` and a `number of blocks = 10` means you will receive a pulse for each of the next 10 consecutive blocks, with a total lifetime of 10 blocks (~1 minute). A frequency of `9` and a `number of blocks = 4` means you receive nothing for 9 blocks, then you get a pulse four times in a row, with a lifetime of 40 blocks.

[View current version on github](https://github.com/ideal-lab5/idn-docs/tree/tony/updates/src/components/PriceSim)

<div>
    <PricingSimulator />
</div>
