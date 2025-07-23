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
│   ├── What is the Ideal Network?
│   ├── Architecture Overview 
│   ├── Compare to Existing Solutions
│   └── Design Philosophy
├── Integrate with IDN
│   ├── Quickstart
│   ├── Parachains (Polkadot/Kusama)
│   │   ├── Runtime Integration Guide
│   │   ├── Using XCM
│   │   └── Verifying Randomness
│   ├── Other Layer-1s
│   │   └── Bridge Design
│   ├── Smart Contracts
│   │   └── ink! Smart Contracts
│   └── SDKs & APIs (optional)
├── Core Technologies
│   ├── Drand Quicknet Randomness Beacon
│   ├── Verifiable Randomness as a Service (VRaaS)
│   ├── Timelock Encryption
│   └── Timelocked Transactions
├── Protocol Reference
│   ├── Runtime Pallets
│   ├── Offchain Workers
│   └── Pulse Format Specification
├── Build & Tutorials
│   ├── Use Verifiable Randomness in an Auction
│   ├── Build a Timelocked Voting Protocol
│   └── Encrypt Data to the Future
├── Ecosystem
│   ├── Funded by Polkadot Treasury
│   ├── Web3 Foundation Grants
│   ├── Network Status (optional)
│   └── Join the IDN Community
├── Resources
│   ├── Litepaper
│   ├── GitHub
│   ├── Glossary
│   └── Code of Conduct