# Ideal Network Docs

Official docs for the Ideal network
### Installation

```
$ yarn
```

### Local Development

```
$ yarn serve
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```
$ yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

Using SSH:

```
$ USE_SSH=true yarn deploy
```

Not using SSH:

```
$ GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.







# Root Sidebar

Ideal Network
├── Introduction
│ ├── What is IDN?
│ ├── Why IDN Exists (The Problem Space)
│ ├── Key Benefits & Capabilities
│ └── How It Works (High-Level)
│
├── Use Cases & Examples
│ ├── VRaaS in Action
│ ├── Timelock Encryption for Coordination
│ ├── Cross-Chain Randomness for Games & Auctions
│ └── Real-World Protocol Examples
│
├── Getting Started
│ ├── Choose Your Integration Path
│ ├── Quickstart Guide
│ ├── FAQs
│ └── Troubleshooting
│
├── Integrate with IDN
│ ├── Parachains (Polkadot/Kusama)
│ │ ├── VRaaS Subscription Cost Model
│ │ ├── Pallets
│ │ │ ├── Runtime Integration Guide
│ │ │ ├── VRaaS Subscription Management
│ │ ├── Smart Contracts
│ │ │ ├── Smart Contract Integration Guide
│ ├── Native Smart Contracts
│ │ └── ink! Smart Contracts
│ └── SDKs & APIs
│
├── Concepts & Technologies
│ ├── Drand Quicknet Randomness Beacon
│ ├── Verifiable Randomness as a Service (VRaaS)
│ ├── Timelock Encryption
│ └── Timelocked Transactions
│
├── Protocol Reference
│ ├── Runtime Pallets
│ ├── Pulse Ingestion Protocol (Sparse Accumulator)
│ └── Pulse Format Specification
│
├── Build with IDN
│ ├── VRaaS Auction (Beginner)
│ ├── Timelocked Voting Protocol (Intermediate)
│ └── Encrypt to the Future (Advanced)
│
├── Ecosystem & Community
│ ├── Projects Using IDN
│ ├── Partners & Integrations
│ └── How to Contribute
│
├── Reference
│ ├── Litepaper
│ ├── GitHub
│ ├── Glossary
│ └── Code of Conduct