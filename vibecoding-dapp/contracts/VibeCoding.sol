// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VibeCoding {
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

    uint public nextSnippetId;
    mapping(uint => CodeSnippet) public snippets;
    uint[] public snippetIds;
    string[] public vibeEmojis;

    event SnippetPosted(uint indexed snippetId, address indexed poster, string title);
    event VibeAdded(uint indexed snippetId, uint indexed vibeId, address indexed vibedBy);

    constructor() {
        vibeEmojis = ["thumbs_up", "fire", "bulb", "thinking"];
        nextSnippetId = 1;
    }

    // Post a new code snippet
    function postSnippet(string memory _title, string memory _description, string memory _codeContent) 
        external 
    {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_codeContent).length > 0, "Code content cannot be empty");
        
        uint snippetId = nextSnippetId;
        
        CodeSnippet storage newSnippet = snippets[snippetId];
        newSnippet.id = snippetId;
        newSnippet.poster = msg.sender;
        newSnippet.title = _title;
        newSnippet.description = _description;
        newSnippet.codeContent = _codeContent;
        newSnippet.timestamp = block.timestamp;
        
        snippetIds.push(snippetId);
        nextSnippetId++;
        
        emit SnippetPosted(snippetId, msg.sender, _title);
    }

    // Add a vibe (emoji reaction) to a snippet
    function addVibe(uint _snippetId, uint _vibeId) external {
        require(_snippetId < nextSnippetId && _snippetId > 0, "Invalid snippet ID");
        require(_vibeId < vibeEmojis.length, "Invalid vibe ID");
        require(!snippets[_snippetId].hasVibed[msg.sender][_vibeId], "You have already vibed with this emoji");
        
        snippets[_snippetId].vibeCounts[_vibeId]++;
        snippets[_snippetId].hasVibed[msg.sender][_vibeId] = true;
        
        emit VibeAdded(_snippetId, _vibeId, msg.sender);
    }

    // Get a snippet's details (excluding mappings)
    function getSnippet(uint _snippetId) external view returns (
        uint id,
        address poster,
        string memory title,
        string memory description,
        string memory codeContent,
        uint timestamp
    ) {
        require(_snippetId < nextSnippetId && _snippetId > 0, "Invalid snippet ID");
        
        CodeSnippet storage snippet = snippets[_snippetId];
        return (
            snippet.id,
            snippet.poster,
            snippet.title,
            snippet.description,
            snippet.codeContent,
            snippet.timestamp
        );
    }

    // Get vibe counts for a specific snippet
    function getVibeCounts(uint _snippetId) external view returns (uint[] memory) {
        require(_snippetId < nextSnippetId && _snippetId > 0, "Invalid snippet ID");
        
        uint[] memory counts = new uint[](vibeEmojis.length);
        for (uint i = 0; i < vibeEmojis.length; i++) {
            counts[i] = snippets[_snippetId].vibeCounts[i];
        }
        return counts;
    }

    // Check if a user has vibed on a snippet with a specific vibe
    function hasUserVibed(uint _snippetId, uint _vibeId, address _user) external view returns (bool) {
        require(_snippetId < nextSnippetId && _snippetId > 0, "Invalid snippet ID");
        require(_vibeId < vibeEmojis.length, "Invalid vibe ID");
        
        return snippets[_snippetId].hasVibed[_user][_vibeId];
    }

    // Get all snippet IDs
    function getAllSnippetIds() external view returns (uint[] memory) {
        return snippetIds;
    }

    // Get all supported vibe emojis
    function getVibeEmojis() external view returns (string[] memory) {
        return vibeEmojis;
    }
}
