// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract VibeCoding {
    struct CodeSnippet {
        uint256 id;
        address poster;
        string title;
        string description;
        string codeContent;
        uint256 timestamp;
    }

    uint256 public nextSnippetId = 1;
    mapping(uint256 => CodeSnippet) public snippets;
    mapping(uint256 => mapping(uint256 => uint256)) public vibeCounts; // snippetId => vibeId => count
    mapping(uint256 => mapping(address => mapping(uint256 => bool))) public hasVibed; // snippetId => user => vibeId => bool
    uint256[] public snippetIds;
    string[] public vibeEmojis;

    event SnippetPosted(uint256 indexed snippetId, address indexed poster, string title);
    event VibeAdded(uint256 indexed snippetId, uint256 indexed vibeId, address indexed vibedBy);    constructor() {
        vibeEmojis = ["thumbs_up", "fire", "bulb", "thinking"];
    }

    function postSnippet(
        string memory _title,
        string memory _description,
        string memory _codeContent
    ) external {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_codeContent).length > 0, "Code content cannot be empty");

        CodeSnippet memory newSnippet = CodeSnippet({
            id: nextSnippetId,
            poster: msg.sender,
            title: _title,
            description: _description,
            codeContent: _codeContent,
            timestamp: block.timestamp
        });

        snippets[nextSnippetId] = newSnippet;
        snippetIds.push(nextSnippetId);

        emit SnippetPosted(nextSnippetId, msg.sender, _title);
        nextSnippetId++;
    }

    function addVibe(uint256 _snippetId, uint256 _vibeId) external {
        require(_snippetId > 0 && _snippetId < nextSnippetId, "Invalid snippet ID");
        require(_vibeId < vibeEmojis.length, "Invalid vibe ID");
        require(!hasVibed[_snippetId][msg.sender][_vibeId], "User has already vibed with this emoji");

        vibeCounts[_snippetId][_vibeId]++;
        hasVibed[_snippetId][msg.sender][_vibeId] = true;

        emit VibeAdded(_snippetId, _vibeId, msg.sender);
    }

    function getSnippet(uint256 _snippetId) external view returns (
        uint256 id,
        address poster,
        string memory title,
        string memory description,
        string memory codeContent,
        uint256 timestamp
    ) {
        require(_snippetId > 0 && _snippetId < nextSnippetId, "Invalid snippet ID");
        CodeSnippet memory snippet = snippets[_snippetId];
        return (
            snippet.id,
            snippet.poster,
            snippet.title,
            snippet.description,
            snippet.codeContent,
            snippet.timestamp
        );
    }

    function getAllSnippetIds() external view returns (uint256[] memory) {
        return snippetIds;
    }

    function getVibeEmojis() external view returns (string[] memory) {
        return vibeEmojis;
    }

    function getVibeCounts(uint256 _snippetId) external view returns (uint256[] memory) {
        require(_snippetId > 0 && _snippetId < nextSnippetId, "Invalid snippet ID");
        uint256[] memory counts = new uint256[](vibeEmojis.length);
        for (uint256 i = 0; i < vibeEmojis.length; i++) {
            counts[i] = vibeCounts[_snippetId][i];
        }
        return counts;
    }

    function hasUserVibed(uint256 _snippetId, uint256 _vibeId, address _user) external view returns (bool) {
        require(_snippetId > 0 && _snippetId < nextSnippetId, "Invalid snippet ID");
        require(_vibeId < vibeEmojis.length, "Invalid vibe ID");
        return hasVibed[_snippetId][_user][_vibeId];
    }
}
