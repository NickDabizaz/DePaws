# VibeCoding DApp - Product Requirements Document (PRD)

**Project Name:** VibeCoding  
**Version:** 1.0 (Minimum Viable Product - MVP)  
**Date:** May 26, 2025  
**Author:** Gemini AI

---

## Table of Contents
1. [Executive Summary](#1-executive-summary)
2. [Vision & Goals](#2-vision--goals)
3. [Target Audience](#3-target-audience)
4. [User Stories / Use Cases](#4-user-stories--use-cases)
5. [Functional Requirements](#5-functional-requirements)
    - [Smart Contract Requirements (Solidity)](#51-smart-contract-requirements-solidity)
    - [Frontend Requirements (React.js)](#52-frontend-requirements-reactjs)
    - [Blockchain Interaction Requirements](#53-blockchain-interaction-requirements)
6. [Non-Functional Requirements](#6-non-functional-requirements)
7. [Technical Architecture (High-Level)](#7-technical-architecture-high-level)
8. [Scope & Out of Scope (MVP)](#8-scope--out-of-scope-mvp)
9. [Monetization Strategy (Conceptual)](#9-monetization-strategy-conceptual)
10. [Future Considerations / Roadmap](#10-future-considerations--roadmap)
11. [Step-by-Step Development & Deployment Plan](#11-detailed-step-by-step-development--deployment-plan)

---

## 1. Executive Summary
VibeCoding is a decentralized application designed to foster a community around sharing and reacting to short code snippets. Unlike traditional centralized platforms, VibeCoding leverages blockchain technology to ensure immutability of code snippets and their associated "vibes" (reactions). The MVP will enable users to post code snippets with titles and descriptions, and allow other users to add simple emoji reactions to these snippets. All core data (snippet metadata, reaction counts) will be stored on a public blockchain, promoting transparency and censorship resistance.

---

## 2. Vision & Goals
**Vision:**  
To create a vibrant, decentralized community where developers can share, discover, and react to inspiring or useful code snippets in a transparent and immutable environment.

**MVP Goals (SMART):**
- **Smart Contract:** Deploy a Solidity smart contract capable of storing code snippet metadata and managing reactions by End of Week 2.
- **Manage:** Enable users to post new code snippets (title, description, code) to the blockchain by End of Week 3.
- **Allow:** Implement functionality for users to add one of a few pre-defined emoji "vibes" to any snippet by End of Week 4.
- **Retrieve:** Display all posted code snippets and their current vibe counts on a simple web interface by End of Week 4.
- **Test:** Successfully deploy and test the full DApp on a public testnet (e.g., Sepolia) by End of Week 5.

---

## 3. Target Audience
- **Primary:** Developers, coding enthusiasts, and students interested in sharing and discovering small, impactful code snippets.
- **Secondary:** Individuals curious about blockchain technology and DApps, looking for a practical example.

---

## 4. User Stories / Use Cases
- As a Developer, I want to post a new code snippet with a title and description, so that I can share my insights with the community.
- As a Developer, I want to see a list of all posted code snippets, so that I can discover new code and learn from others.
- As a Developer, I want to add a "vibe" (emoji reaction) to a code snippet, so that I can express my appreciation or sentiment towards it.
- As a Developer, I want to see the total count of each type of "vibe" on a snippet, so that I can gauge its community reception.
- As a User, I want to connect my MetaMask wallet to the DApp, so that I can interact with the blockchain.

---

## 5. Functional Requirements

### 5.1. Smart Contract Requirements (Solidity)
The `VibeCoding.sol` smart contract will manage all core DApp logic and data storage.

**Snippet Structure:**
```solidity
struct CodeSnippet {
    uint id;
    address poster;
    string title;
    string description;
    string codeContent; // For small snippets, stored directly on-chain.
    uint timestamp;
    mapping(uint => uint) vibeCounts; // Maps vibe ID (e.g., 0 for 👍, 1 for 🔥) to count.
    mapping(address => mapping(uint => bool)) hasVibed; // Tracks if an address has vibed on a specific snippet with a specific vibe ID.
}
```

**State Variables:**
- `uint public nextSnippetId;` // Auto-incrementing ID for new snippets.
- `mapping(uint => CodeSnippet) public snippets;` // Stores all snippets by ID.
- `uint[] public snippetIds;` // Array to easily iterate over all snippet IDs.
- `string[] public vibeEmojis;` // Array of supported emoji strings (e.g., `["👍", "🔥", "💡", "🤔"]`).

**Functions:**
- `constructor()`: Initializes `vibeEmojis` with a predefined set of emojis.
- `postSnippet(string _title, string _description, string _codeContent)`:
    - Creates a new `CodeSnippet` struct.
    - Assigns `msg.sender` as poster and `block.timestamp`.
    - Increments `nextSnippetId`.
    - Emits `SnippetPosted` event.
- `addVibe(uint _snippetId, uint _vibeId)`:
    - Requires `_snippetId` to be valid.
    - Requires `_vibeId` to be a valid index in `vibeEmojis`.
    - Requires `msg.sender` has not already added this specific vibe to this snippet.
    - Increments `vibeCounts[_vibeId]` for the given snippet.
    - Sets `hasVibed[msg.sender][_vibeId]` to true for the snippet.
    - Emits `VibeAdded` event.
- `getSnippet(uint _snippetId) view returns (...)`:
    - Returns all details of a specific snippet.
- `getAllSnippetIds() view returns (uint[] memory)`:
    - Returns an array of all snippet IDs.
- `getVibeEmojis() view returns (string[] memory)`:
    - Returns the list of supported vibe emojis.
- `getVibeCounts(uint _snippetId) view returns (uint[] memory)`:
    - Returns an array of vibe counts for a given snippet, corresponding to `vibeEmojis` order.
- `hasUserVibed(uint _snippetId, uint _vibeId, address _user) view returns (bool)`:
    - Checks if a specific user has added a specific vibe to a snippet.

**Events:**
```solidity
event SnippetPosted(uint indexed snippetId, address indexed poster, string title);
event VibeAdded(uint indexed snippetId, uint indexed vibeId, address indexed vibedBy);
```

---

### 5.2. Frontend Requirements (React.js)
The web interface will be built using React.js for a dynamic and responsive user experience.

**Wallet Connection:**
- Prominent "Connect Wallet" button.
- Displays connected wallet address (truncated).
- Handles MetaMask detection and connection.

**Navigation:**
- Simple top navigation (e.g., "Home", "Post Snippet").

**Home/Snippet List Page:**
- Displays a list of all posted code snippets.
- Each snippet card/component will show:
    - Snippet Title
    - Snippet Description
    - Code Content (formatted, e.g., in a `<code>` block)
    - Poster's Address (truncated)
    - Timestamp
    - Vibe Buttons: Each supported emoji with its current count
    - Clicking a vibe button (if wallet connected) triggers `addVibe` transaction
    - Visual feedback if a user has already added a specific vibe to a snippet
    - Loading indicator while fetching snippets
    - Error message display if blockchain interaction fails

**Post Snippet Page:**
- Form with input fields for:
    - Title (text input)
    - Description (textarea)
    - Code Content (textarea, potentially with monospace font)
    - "Post Snippet" button
- Loading indicator during transaction
- Success/error messages after posting
- Requires wallet connection to post

---

### 5.3. Blockchain Interaction Requirements
- **Provider:** Connects to the Ethereum network via MetaMask (or similar injected provider).
- **Signer:** Allows the connected user to sign transactions.
- **Contract Instance:** Uses Ethers.js to create an instance of the deployed smart contract using its ABI and address.

**Transaction Handling:**
- Sends transactions for `postSnippet` and `addVibe`.
- Waits for transaction confirmation.
- Handles transaction errors (e.g., user rejection, gas limits).

**Data Fetching:**
- Calls view functions (`getSnippet`, `getAllSnippetIds`, `getVibeEmojis`, `getVibeCounts`, `hasUserVibed`) to retrieve data.
- Polls or uses onSnapshot (if applicable, though less common for simple contract reads) to update UI with latest data. For this MVP, simple polling or re-fetching on relevant events is sufficient.

---

## 6. Non-Functional Requirements
- **Performance:**
    - Frontend should load within 3 seconds on a standard broadband connection.
    - Blockchain transactions are dependent on network congestion but should provide timely feedback to the user.
- **Security:**
    - Smart contract code will be audited (conceptually for this PRD).
    - Frontend will sanitize user inputs to prevent XSS.
    - Private keys are never handled by the DApp directly (MetaMask handles this).
- **Usability:**
    - Intuitive and clean user interface.
    - Clear feedback for all user actions (loading, success, error).
    - Responsive design for mobile and desktop browsers.
- **Scalability:**
    - Smart Contract: For this MVP, storing code directly on-chain is acceptable for small snippets. For larger scale, future versions would integrate IPFS for code content, storing only the IPFS hash on-chain.
    - Frontend: React's component-based architecture supports future expansion.
- **Compatibility:**
    - Works with modern web browsers (Chrome, Firefox, Edge, Safari).
    - Compatible with MetaMask wallet.

---

## 7. Technical Architecture (High-Level)
- **Blockchain:** Ethereum (Sepolia Testnet for MVP)
- **Smart Contract Language:** Solidity (version ^0.8.0 or higher)
- **Development Environment:** Hardhat (recommended for structured development, testing, and deployment scripts)
- **Frontend Framework:** React.js (with Vite or Create React App for setup)
- **Blockchain Interaction Library:** Ethers.js (preferred over Web3.js for modern React development)
- **Styling:** Tailwind CSS (for rapid, responsive UI development)
- **Package Manager:** npm / yarn

---

## 8. Scope & Out of Scope (MVP)
### 8.1. In Scope
- Posting new code snippets
- Viewing all posted code snippets
- Adding pre-defined emoji "vibes" to snippets
- Displaying vibe counts for each snippet
- Basic wallet connection (MetaMask)
- Responsive web interface

### 8.2. Out of Scope (for MVP - Future Considerations)
- User authentication beyond wallet address
- Profile pages for users
- Editing or deleting snippets
- Commenting on snippets
- Searching or filtering snippets
- Advanced moderation features
- Integration with IPFS for larger code snippets
- Tokenomics or monetization
- Complex real-time collaborative editing
- Notifications
- Support for multiple blockchain networks

---

## 9. Monetization Strategy (Conceptual - Not for MVP)
- Potentially a small fee (in ETH) for posting snippets to cover gas and support the platform
- Premium "vibe" packs or custom emojis
- NFTs for "top vibed" snippets or community achievements

---

## 10. Future Considerations / Roadmap
- **Phase 2:** User profiles, search/filter, basic commenting
- **Phase 3:** IPFS integration for larger code snippets, more advanced reaction types (e.g., custom emojis)
- **Phase 4:** Governance (DAO), tokenomics, advanced moderation
- **Phase 5:** Real-time collaborative editing (more complex, likely requiring off-chain solutions with on-chain anchoring)

---

## 11. Detailed Step-by-Step Development & Deployment Plan

### Phase 1: Planning & Setup (Estimated: 2-3 Days)
**Project Initialization:**
1. Create Project Directory:
    ```bash
    mkdir vibecoding-dapp && cd vibecoding-dapp
    ```
2. Initialize Hardhat Project:
    ```bash
    npx hardhat # Choose "Create a basic sample project"
    ```
3. Initialize React Project:
    ```bash
    npm create vite@latest frontend -- --template react
    # or
    npx create-react-app frontend
    ```
4. Install Dependencies:
    - In Hardhat root:
        ```bash
        npm install --save-dev @nomicfoundation/hardhat-ethers @openzeppelin/contracts
        ```
    - In frontend directory:
        ```bash
        cd frontend
        npm install ethers tailwindcss postcss autoprefixer
        npx tailwindcss init -p
        ```
    - Configure `tailwind.config.js` to scan React files.

**Blockchain Environment Setup:**
1. Install MetaMask: Ensure MetaMask browser extension is installed and configured.
2. Get Sepolia Testnet ETH: Use a faucet (e.g., Alchemy Sepolia Faucet) to get test ETH for deployment and transactions.
3. Configure Hardhat for Sepolia:
    - Add Sepolia network configuration to `hardhat.config.js` with your Alchemy/Infura API key and MetaMask private key (use environment variables for security, e.g., `process.env.PRIVATE_KEY`).
    - Example `hardhat.config.js` snippet:
        ```js
        require("@nomicfoundation/hardhat-ethers");
        require("dotenv").config(); // npm install dotenv

        module.exports = {
          solidity: "0.8.20", // Or latest stable version
          networks: {
            sepolia: {
              url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
              accounts: [process.env.PRIVATE_KEY],
            },
          },
        };
        ```

**Basic Contract Design (High-Level):**
- Sketch out the `CodeSnippet` struct and the main functions (`postSnippet`, `addVibe`, `getSnippet`, `getAllSnippetIds`).
- Define the initial set of `vibeEmojis`.

---

### Phase 2: Smart Contract Development (Estimated: 3-4 Days)
1. Create Contract File: `contracts/VibeCoding.sol`
2. Define Pragma & SPDX License:
    ```solidity
    // SPDX-License-Identifier: MIT
    pragma solidity ^0.8.20; // Use a recent stable version
    ```
3. Define `CodeSnippet` struct: Implement the struct as specified in Section 5.1.
4. Define State Variables: Implement `nextSnippetId`, `snippets`, `snippetIds`, `vibeEmojis`.
5. Implement constructor: Initialize `vibeEmojis`.
6. Implement `postSnippet` function:
    - Increment `nextSnippetId`.
    - Create new `CodeSnippet` instance.
    - Store in `snippets` mapping and add ID to `snippetIds` array.
    - Emit `SnippetPosted` event.
7. Implement `addVibe` function:
    - Add require checks for valid `_snippetId` and `_vibeId`.
    - Add require check to prevent double-vibing by the same user for the same vibe ID on the same snippet.
    - Increment vibe count.
    - Mark user as having vibed.
    - Emit `VibeAdded` event.
8. Implement view functions: `getSnippet`, `getAllSnippetIds`, `getVibeEmojis`, `getVibeCounts`, `hasUserVibed`.
9. Compile Smart Contract:
    ```bash
    npx hardhat compile
    ```
    - Resolve any compilation errors.

---

### Phase 3: Smart Contract Testing & Deployment (Estimated: 2-3 Days)
**Write Unit Tests (Hardhat/Ethers.js):**
1. Create Test File: `test/VibeCoding.js`
2. Test `postSnippet`:
    - Verify snippet is stored correctly.
    - Verify `SnippetPosted` event is emitted.
3. Test `addVibe`:
    - Verify vibe count increases.
    - Verify `VibeAdded` event is emitted.
    - Test edge cases: invalid snippet ID, invalid vibe ID, double-vibing.
4. Test view functions: Ensure they return correct data.
5. Run Tests:
    ```bash
    npx hardhat test
    ```
    - Iterate and fix any contract bugs.

**Create Deployment Script:**
1. Create Script File: `scripts/deploy.js`
2. Write Deployment Logic:
    - Get VibeCoding contract factory.
    - Deploy the contract.
    - Log the deployed contract address.

**Deploy to Local Network (Hardhat Network/Ganache):**
1. Run Local Node:
    ```bash
    npx hardhat node
    ```
2. Deploy:
    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```
    - Verify deployment success and note the contract address.

**Deploy to Sepolia Testnet:**
1. Deploy:
    ```bash
    npx hardhat run scripts/deploy.js --network sepolia
    ```
2. Verify on Etherscan: Copy the deployed address and check it on Sepolia Etherscan to confirm deployment and view transactions.
3. Save Contract ABI and Address: Copy the generated ABI (from `artifacts/contracts/VibeCoding.sol/VibeCoding.json`) and the deployed address to a file in your frontend project (e.g., `frontend/src/contract_config.js`). This is crucial for frontend interaction.

---

### Phase 4: Frontend Development (Estimated: 4-5 Days)
**Basic React App Structure:**
1. Clean `frontend/src/App.jsx`: Remove boilerplate.
2. Setup Tailwind CSS: Ensure `tailwind.config.js` is configured and `index.css` imports Tailwind directives.
3. Create Components:
    - `WalletConnect.jsx`: Handles MetaMask connection.
    - `SnippetCard.jsx`: Displays a single snippet.
    - `PostSnippetForm.jsx`: Form for posting new snippets.
    - `LoadingSpinner.jsx`, `ErrorMessage.jsx`.

**Wallet Connection & Ethers.js Setup:**
1. In `App.jsx` (or a context/hook):
    - Import ethers.
    - Use `useState` for provider, signer, contract, account.
    - Implement `connectWallet` function:
        - Check `window.ethereum`.
        - Request accounts: `await window.ethereum.request({ method: 'eth_requestAccounts' })`.
        - Create Web3Provider and JsonRpcSigner.
        - Create Contract instance using ABI and address.
        - Update state variables.
        - Add event listener for `accountsChanged` from `window.ethereum`.

**Implement PostSnippetForm:**
1. Form State: `useState` for title, description, code content.
2. `handleSubmit` function:
    - Call `contract.postSnippet(title, description, codeContent)`.
    - Handle loading state.
    - Wait for transaction confirmation: `await tx.wait()`.
    - Clear form, show success message.
    - Handle try/catch for errors (e.g., user rejects transaction).
3. Conditional Rendering: Only show form if wallet is connected.

**Implement SnippetCard:**
1. Props: Takes snippet object as prop.
2. Display Snippet Details: Title, description, code, poster, timestamp.
3. Vibe Buttons:
    - Map over `vibeEmojis` from contract.
    - For each emoji, display a button with the emoji and its count.
    - `onClick` handler for each button: `addVibe(snippet.id, vibeId)`.
    - Visually indicate if the current user has already vibed on this snippet with this specific vibe.

**Implement Main Snippet List (App.jsx or dedicated component):**
1. Fetch Snippets:
    - `useEffect` hook to fetch `getAllSnippetIds()` on component mount.
    - For each ID, fetch `getSnippet(id)` and `getVibeCounts(id)`.
    - Store fetched snippets in `useState`.
    - Handle loading state.
2. Render List: Map over the snippets array and render `SnippetCard` for each.
3. Refresh Mechanism: Implement a way to re-fetch snippets after a new snippet is posted or a vibe is added (e.g., re-run `useEffect` or call a refresh function).

---

### Phase 5: Integration & Testing (Estimated: 2-3 Days)
**Connect Frontend to Deployed Contract:**
1. Update `contract_config.js`: Ensure the ABI and Sepolia contract address are correctly copied.
2. Test Wallet Connection: Verify MetaMask connects and correct address is displayed.
3. Test Post Snippet:
    - Post a new snippet from the UI.
    - Verify transaction appears in MetaMask.
    - Verify snippet appears on the main list after refresh.
    - Check Sepolia Etherscan for the transaction.
4. Test Add Vibe:
    - Click a vibe button.
    - Verify transaction in MetaMask.
    - Verify vibe count updates on the UI.
    - Check Sepolia Etherscan for the transaction.
5. Test View Snippets: Ensure all details are correctly displayed.
6. Responsive Testing: Check layout and functionality on different screen sizes (mobile, tablet, desktop) using browser developer tools.
7. Error Handling Testing:
    - Disconnect wallet and try to post/vibe.
    - Reject a MetaMask transaction.
    - Ensure appropriate error messages are displayed.

---

### Phase 6: Deployment & Launch (Estimated: 1 Day)
**Frontend Build:**
1. Build React App:
    ```bash
    cd frontend && npm run build
    ```
    - This creates a `dist` (or `build`) folder with optimized static files.

**Deployment to Hosting (e.g., Netlify, Vercel, IPFS Gateway):**
1. Choose Hosting: Select a static site hosting provider.
2. Deploy: Upload the contents of the `dist` (or `build`) folder.
3. Configure Domain (Optional): If using a custom domain.

**Final Checks:**
1. Live Test: Access the deployed DApp URL and perform all user stories.
2. Browser Compatibility: Test on major browsers.

---

### Phase 7: Post-Launch & Iteration (Ongoing)
- **Monitor:**
    - Contract Activity: Monitor transactions on Sepolia Etherscan.
    - Frontend Logs: Monitor any errors reported by the hosting provider.
- **Gather Feedback:** Collect user feedback on usability and desired features.
- **Plan Next Iteration:** Based on feedback and monitoring, prioritize features for VibeCoding 1.1 (e.g., IPFS integration, search, user profiles).

---

**best practices for writing Git commit messages**, especially when working in teams or open-source projects:

---

### ✅ **Conventional Commit Format (Recommended)**

```
<type>(optional-scope): <short description>

[optional body]

[optional footer]
```

### 📌 **Common Types**

| Type       | Purpose                                                |
| ---------- | ------------------------------------------------------ |
| `feat`     | A new feature                                          |
| `fix`      | A bug fix                                              |
| `docs`     | Documentation-only changes                             |
| `style`    | Code style change (formatting, missing semi-colons...) |
| `refactor` | Code refactor (no features or fixes)                   |
| `test`     | Adding or fixing tests                                 |
| `chore`    | Build process or tooling changes                       |
| `perf`     | Performance improvement                                |
| `ci`       | Continuous Integration changes                         |

---

### 🛠️ **Examples**

```
feat(auth): add JWT-based login
fix(api): handle null user ID on fetch
docs(readme): update usage instructions
style: reformat code using Prettier
refactor(db): extract query logic into helper
test(user): add tests for password reset
chore: update dependencies
```

---

### 🧠 **Tips for Writing Good Commits**

* **Use imperative mood** in description: “fix bug” not “fixed bug”.
* **Keep short line ≤ 72 characters.**
* **Describe *why* and *what*, not *how*** in the body.
* **Group related changes into a single commit.**
* **Avoid vague messages** like `update`, `fix`, or `stuff`.

---
