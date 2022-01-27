//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ArcadiumToken is ERC20 {
    address private _owner;
    mapping(address => bool) private _playerIsPlaying;

    uint256 public constant CONVERSION_RATE = 10;
    uint256 public constant GAME_PRICE = 1;
    uint256 public constant WIN_MULTIPLIER = 2;

    constructor(uint256 initialSupply) ERC20("ArcadiumToken", "ARC") {
        _mint(msg.sender, initialSupply);
        _owner = msg.sender;
    }

    function buy() external payable {
        require(msg.value > 0, "No ETH transferred");
        _transfer(_owner, msg.sender, msg.value * CONVERSION_RATE);
    }

    function play() external {
        require(balanceOf(msg.sender) > 0, "Player has no tokens");
        require(
            _playerIsPlaying[msg.sender] == false,
            "Player cannot be playing"
        );
        _playerIsPlaying[msg.sender] = true;
        _transfer(msg.sender, _owner, GAME_PRICE);
    }

    function win() external {
        require(_playerIsPlaying[msg.sender] == true, "Player must be playing");
        _playerIsPlaying[msg.sender] = false;
        _transfer(_owner, msg.sender, GAME_PRICE * WIN_MULTIPLIER);
    }
}
