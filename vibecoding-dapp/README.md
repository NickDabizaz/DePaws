# VibeCoding DApp 🚀

A decentralized application for sharing and reacting to code snippets with emoji "vibes" on the blockchain.

## 🎯 Project Status: Phase 4 Complete ✅

### ✅ Completed Features
- **Smart Contract**: VibeCoding.sol deployed on Sepolia testnet
- **Frontend Components**: Complete React application with Tailwind CSS
- **Wallet Integration**: MetaMask connection and network detection  
- **Code Snippet Posting**: Full form with validation and character limits
- **Vibe Reactions**: Emoji reactions with user state tracking
- **Responsive Design**: Modern UI with loading states and error handling

### 📋 Contract Details
- **Network**: Sepolia Testnet
- **Contract Address**: `0x3619143796291bC13d0Ccc441D2262096576e6C7`
- **Supported Vibes**: 👍 (thumbs_up), 🔥 (fire), 💡 (bulb), 🤔 (thinking)

## 🛠️ Setup & Development

### Prerequisites
- Node.js 18+ 
- MetaMask browser extension
- Sepolia testnet ETH (get from [faucet](https://sepoliafaucet.com/))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/NickDabizaz/DePaws.git
cd DePaws/vibecoding-dapp
```

2. **Install dependencies**
```bash
# Install Hardhat dependencies
npm install

# Install frontend dependencies  
cd frontend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Root .env file (for contract deployment)
ALCHEMY_API_KEY=your_alchemy_api_key
PRIVATE_KEY=your_wallet_private_key
ETHERSCAN_API_KEY=your_etherscan_api_key

# Frontend .env file
cd frontend
echo "VITE_CONTRACT_ADDRESS=0x3619143796291bC13d0Ccc441D2262096576e6C7" > .env
```

### Running the Application

1. **Start the frontend development server**
```bash
cd frontend
npm run dev
```

2. **Open your browser**
   - Navigate to `http://localhost:5173` (or the port shown in terminal)
   - Connect your MetaMask wallet 
   - Switch to Sepolia testnet

## 🎮 How to Use

### 1. Connect Wallet
- Click "Connect Wallet" button
- Approve MetaMask connection
- Ensure you're on Sepolia testnet

### 2. Post a Code Snippet
- Click "Post Snippet" in navigation
- Fill in title, description, and code
- Submit transaction and wait for confirmation

### 3. React with Vibes
- Browse posted snippets on the home page
- Click emoji buttons to add your vibe reaction
- Each user can only vibe once per emoji per snippet

## 🏗️ Architecture

### Smart Contract (`contracts/VibeCoding.sol`)
- **Snippet Storage**: Title, description, code content, and metadata
- **Vibe System**: Four emoji types with user tracking
- **Access Control**: Public posting, one vibe per user per emoji
- **Events**: SnippetPosted and VibeAdded for frontend integration

### Frontend (`frontend/src/`)
- **App.jsx**: Main application logic and state management
- **WalletConnect.jsx**: MetaMask integration and network detection
- **PostSnippetForm.jsx**: Code snippet submission form
- **SnippetCard.jsx**: Code display with syntax highlighting and vibe buttons
- **LoadingSpinner.jsx** & **ErrorMessage.jsx**: UI utilities

## 🧪 Testing

### Run Smart Contract Tests
```bash
npx hardhat test
```

### Test Contract on Sepolia
```bash
npx hardhat run test-contract.js --network sepolia
```

## 🚀 Deployment

### Deploy New Contract
```bash
npx hardhat run scripts/deploy.js --network sepolia
```

### Frontend Build
```bash
cd frontend
npm run build
```

## 📁 Project Structure
```
vibecoding-dapp/
├── contracts/           # Smart contracts
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── App.jsx    # Main application
│   │   └── ...
├── scripts/           # Deployment scripts
├── test/             # Contract tests
└── ...
```

## 🔗 Links
- **GitHub Repository**: https://github.com/NickDabizaz/DePaws
- **Sepolia Etherscan**: https://sepolia.etherscan.io/address/0x3619143796291bC13d0Ccc441D2262096576e6C7

## 📝 Next Steps (Future Enhancements)
- [ ] Deploy to mainnet
- [ ] Add code syntax highlighting
- [ ] Implement snippet categories/tags
- [ ] Add user profiles and reputation system
- [ ] Integrate with IPFS for decentralized storage
- [ ] Add comments and discussions
- [ ] Implement snippet search and filtering

## 🤝 Contributing
Follow conventional commit format:
- `feat: description` for new features
- `fix: description` for bug fixes  
- `docs: description` for documentation
- `test: description` for tests

---
Built with ❤️ using React, Tailwind CSS, Hardhat, and Solidity
