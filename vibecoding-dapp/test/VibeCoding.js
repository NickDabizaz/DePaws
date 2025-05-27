const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VibeCoding", function () {
  let vibeCoding;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    const VibeCoding = await ethers.getContractFactory("VibeCoding");
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy the contract
    vibeCoding = await VibeCoding.deploy();
  });

  describe("Deployment", function () {
    it("Should set the correct initial state", async function () {
      expect(await vibeCoding.nextSnippetId()).to.equal(1);
      
      const vibeEmojis = await vibeCoding.getVibeEmojis();
      expect(vibeEmojis).to.deep.equal(["thumbs_up", "fire", "bulb", "thinking"]);
    });
  });

  describe("Posting Snippets", function () {
    it("Should post a snippet successfully", async function () {
      const title = "Hello World";
      const description = "A simple hello world function";
      const codeContent = "function hello() { console.log('Hello World!'); }";

      await expect(vibeCoding.postSnippet(title, description, codeContent))
        .to.emit(vibeCoding, "SnippetPosted")
        .withArgs(1, owner.address, title);

      const snippet = await vibeCoding.getSnippet(1);
      expect(snippet.id).to.equal(1);
      expect(snippet.poster).to.equal(owner.address);
      expect(snippet.title).to.equal(title);
      expect(snippet.description).to.equal(description);
      expect(snippet.codeContent).to.equal(codeContent);
    });

    it("Should increment snippet ID for each new post", async function () {
      await vibeCoding.postSnippet("Title 1", "Desc 1", "Code 1");
      await vibeCoding.postSnippet("Title 2", "Desc 2", "Code 2");

      expect(await vibeCoding.nextSnippetId()).to.equal(3);
      
      const snippetIds = await vibeCoding.getAllSnippetIds();
      expect(snippetIds).to.deep.equal([1, 2]);
    });

    it("Should reject empty title", async function () {
      await expect(
        vibeCoding.postSnippet("", "description", "code")
      ).to.be.revertedWith("Title cannot be empty");
    });

    it("Should reject empty code content", async function () {
      await expect(
        vibeCoding.postSnippet("title", "description", "")
      ).to.be.revertedWith("Code content cannot be empty");
    });
  });

  describe("Adding Vibes", function () {
    beforeEach(async function () {
      // Post a snippet first
      await vibeCoding.postSnippet("Test Title", "Test Description", "Test Code");
    });

    it("Should add a vibe successfully", async function () {
      await expect(vibeCoding.connect(addr1).addVibe(1, 0))
        .to.emit(vibeCoding, "VibeAdded")
        .withArgs(1, 0, addr1.address);

      const vibeCounts = await vibeCoding.getVibeCounts(1);
      expect(vibeCounts[0]).to.equal(1);
      expect(vibeCounts[1]).to.equal(0);
      expect(vibeCounts[2]).to.equal(0);
      expect(vibeCounts[3]).to.equal(0);
    });

    it("Should track user vibe status", async function () {
      await vibeCoding.connect(addr1).addVibe(1, 0);
      
      expect(await vibeCoding.hasUserVibed(1, 0, addr1.address)).to.be.true;
      expect(await vibeCoding.hasUserVibed(1, 1, addr1.address)).to.be.false;
      expect(await vibeCoding.hasUserVibed(1, 0, addr2.address)).to.be.false;
    });

    it("Should prevent double vibing with same emoji", async function () {
      await vibeCoding.connect(addr1).addVibe(1, 0);
      
      await expect(
        vibeCoding.connect(addr1).addVibe(1, 0)
      ).to.be.revertedWith("User has already vibed with this emoji");
    });

    it("Should allow multiple users to vibe with same emoji", async function () {
      await vibeCoding.connect(addr1).addVibe(1, 0);
      await vibeCoding.connect(addr2).addVibe(1, 0);
      
      const vibeCounts = await vibeCoding.getVibeCounts(1);
      expect(vibeCounts[0]).to.equal(2);
    });

    it("Should allow same user to vibe with different emojis", async function () {
      await vibeCoding.connect(addr1).addVibe(1, 0);
      await vibeCoding.connect(addr1).addVibe(1, 1);
      
      const vibeCounts = await vibeCoding.getVibeCounts(1);
      expect(vibeCounts[0]).to.equal(1);
      expect(vibeCounts[1]).to.equal(1);
    });

    it("Should reject invalid snippet ID", async function () {
      await expect(
        vibeCoding.addVibe(999, 0)
      ).to.be.revertedWith("Invalid snippet ID");
    });

    it("Should reject invalid vibe ID", async function () {
      await expect(
        vibeCoding.addVibe(1, 999)
      ).to.be.revertedWith("Invalid vibe ID");
    });
  });

  describe("View Functions", function () {
    beforeEach(async function () {
      await vibeCoding.postSnippet("Title 1", "Description 1", "Code 1");
      await vibeCoding.postSnippet("Title 2", "Description 2", "Code 2");
      await vibeCoding.connect(addr1).addVibe(1, 0);
      await vibeCoding.connect(addr2).addVibe(1, 1);
    });

    it("Should return all snippet IDs", async function () {
      const snippetIds = await vibeCoding.getAllSnippetIds();
      expect(snippetIds).to.deep.equal([1, 2]);
    });

    it("Should return correct vibe counts", async function () {
      const vibeCounts = await vibeCoding.getVibeCounts(1);
      expect(vibeCounts).to.deep.equal([1, 1, 0, 0]);
    });

    it("Should return vibe emojis", async function () {
      const vibeEmojis = await vibeCoding.getVibeEmojis();
      expect(vibeEmojis).to.deep.equal(["thumbs_up", "fire", "bulb", "thinking"]);
    });
  });
});
