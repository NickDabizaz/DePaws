const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying VibeCoding contract...");

  // Get the signer
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Get the ContractFactory and deploy
  const VibeCoding = await ethers.getContractFactory("VibeCoding");
  const vibeCoding = await VibeCoding.deploy();

  // Wait for deployment to complete
  await vibeCoding.waitForDeployment();

  const contractAddress = await vibeCoding.getAddress();
  console.log("VibeCoding deployed to:", contractAddress);

  // Wait for a few block confirmations to ensure the contract is deployed
  console.log("Waiting for block confirmations...");
  await vibeCoding.deploymentTransaction().wait(6);

  console.log("Contract deployed and confirmed!");
  
  // Verify initial state
  const vibeEmojis = await vibeCoding.getVibeEmojis();
  console.log("Supported vibe emojis:", vibeEmojis);
  
  console.log("Next snippet ID:", await vibeCoding.nextSnippetId());

  return contractAddress;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then((contractAddress) => {
    console.log(`\n🎉 Deployment successful!`);
    console.log(`📋 Contract Address: ${contractAddress}`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Copy the contract address to your frontend .env file`);
    console.log(`2. Update VITE_CONTRACT_ADDRESS in frontend/.env`);
    console.log(`3. Copy the ABI from artifacts/contracts/VibeCoding.sol/VibeCoding.json`);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
