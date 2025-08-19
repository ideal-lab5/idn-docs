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

Ideal Network Documentation

# Ideal Network Documentation

---

### **1. Overview** 🧠
* **What is the Ideal Network?**
* **Core Capabilities:** *A high-level overview of the network's features and use cases without the technical details.*

right now these are both lumped under 'use cases' as a big table, could break it into pieces though
* **What you can do with VRaaS:** *A page dedicated to use cases like lotteries, NFT drops, and leader elections.*
* **What you can do with Timelock Encryption:** *A page dedicated to use cases like fair auctions, sealed bids, and MEV-proof transactions.*

---

### **2. Getting Started** 🚀
* **Quickstart:** *The main entry page.*
* Integrate with the Ideal Network
* Subscription Overview and Cost Model for VRaaS

---

### **3. Guides & Tutorials** 📖
* **Verifiable Randomness-as-a-Service (VRaaS)**
    * Ink! Smart Contract Integration Guide
    * Parachain Runtime Integration Guide
    * VRaaS Subscription Management
* **Timelock Encryption**
    * Timelocked Transactions (The Frontend Library)
    * Ink! Smart Contracts on the Ideal Network
* **Randomness Guides**
    * Randomness Verification
    * **Free On-Chain Randomness:** *How to fetch free, non-verifiable randomness from a chain extension on Ideal Network.*

---

### **4. Concepts & Core Technologies** ⚙️
* How it Works
* The Randomness Distribution Model
* The Timelock Protocol

---

### **5. Protocol & API Reference** 🛠️
* **Frontend SDK Reference**
* **Ink! Smart Contract Library Reference**
* **Runtime Pallets**
* **Protocol Reference**