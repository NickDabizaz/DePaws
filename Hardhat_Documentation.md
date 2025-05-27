# 📘 Hardhat + Alchemy (Sepolia) Smart Contract Workflow

A minimal guide to compile, deploy, and verify Solidity smart contracts using Hardhat on Sepolia via Alchemy.

---

## 🧱 Project Setup

### 1. Initialize Project

```bash
mkdir my-hardhat-project
cd my-hardhat-project
npm init -y
npm install --save-dev hardhat
npx hardhat
```

Choose: `Create a basic sample project`

---

## 🧩 Dependencies

```bash
npm install --save-dev dotenv
npm install --save ethers
```

---

## 📄 Project Structure

```
my-hardhat-project/
├── contracts/
│   └── MyContract.sol
├── scripts/
│   └── deploy.js
├── .env
├── hardhat.config.js
└── package.json
```

---

## 🔐 .env Configuration

Create a `.env` file to store sensitive data.

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/yourAlchemyKey
PRIVATE_KEY=your_private_wallet_key
```

> ⚠️ Never share your private key. Use a burner wallet for testing.

---

## ⚙️ Hardhat Config

Update `hardhat.config.js`:

```js
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.21",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};
```

---

## 🛠 Compile Contract

```bash
npx hardhat compile
```

---

## 🚀 Deploy Contract

Edit `scripts/deploy.js`:

```js
const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("MyContract");
  const contract = await Contract.deploy();
  await contract.deployed();

  console.log(`Deployed to: ${contract.address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Then run:

```bash
npx hardhat run scripts/deploy.js --network sepolia
```

---

## ✅ Verify on Etherscan (Optional)

Install plugin:

```bash
npm install --save-dev @nomicfoundation/hardhat-verify
```

Update config:

```js
require("@nomicfoundation/hardhat-verify");
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  // ... existing config
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};
```

In `.env`:

```env
ETHERSCAN_API_KEY=yourEtherscanKey
```

Then:

```bash
npx hardhat verify --network sepolia DEPLOYED_CONTRACT_ADDRESS
```

---

## 📦 Extra: Useful Commands

```bash
npx hardhat accounts
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network sepolia
```

---

Let me know if you want a version that includes unit testing or automated docgen as well.
