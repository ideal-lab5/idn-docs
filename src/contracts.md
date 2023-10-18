# Smart Contracts

The ETF network supports ink! smart contracts via Substrate's pallet-contracts. 

## Chain Extension and ETF Environment

The ETF Network uses a custom chain extension to allow smart contracts to check if a slot is in the future or in the past. The chain extension allows you to check if a block has been authored in a given slot, which is very useful in cases where it is important to know if data *can* be decrypted. The custom environment can be configured in ink! smart contracts to call the chain extension exposed by the ETF network runtime.

See the [auction orchestrator]() for an example.

#### ETF Environment setup

1. Add the dependency to your contract
``` toml
etf-chain-extension = { version = "0.1.0, default-features = false, features = ["ink-as-dependency"] }
```

2. Configure the environment in your contract
``` rust
use etf_chain_extension::ext::EtfEnvironment;
#[ink::contract(env = EtfEnvironment)]
mod your_smart_contract {
    use crate::EtfEnvironment;
    ...
}
```

3. Query the runtime to check if a block has been authored in the slot.

``` rust
self.env()
    .extension()
    .check_slot(deadline)
```
