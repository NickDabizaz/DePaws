const { ethers } = require("hardhat");

async function testContract() {
  const contractAddress = "0x3619143796291bC13d0Ccc441D2262096576e6C7";
  const VibeCoding = await ethers.getContractFactory("VibeCoding");
  const contract = VibeCoding.attach(contractAddress);

  console.log("Testing VibeCoding contract at:", contractAddress);

  try {
    // Test reading vibe emojis
    const emojis = await contract.getVibeEmojis();
    console.log("✅ Vibe emojis:", emojis);

    // Test reading next snippet ID
    const nextId = await contract.nextSnippetId();
    console.log("✅ Next snippet ID:", nextId.toString());

    // Test reading total snippets count
    const snippetIds = await contract.getAllSnippetIds();
    console.log("✅ Total snippets:", snippetIds.length);

    console.log("🎉 Contract is working correctly!");
  } catch (error) {
    console.error("❌ Error testing contract:", error.message);
  }
}

testContract()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
