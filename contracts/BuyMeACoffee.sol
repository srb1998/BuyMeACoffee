// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Contract Deployed at address:-  0xD2DB026ca1f88F8ac0CCFe5F20FE8283aEd3aAeB
contract BuyMeACoffee {
    //Event to emit when a memo is created
    event NewMemo(
        address indexed from,
        uint256 timestamp,
        string name,
        string message
    );

    //Memo Struct
    struct Memo {
        address from;
        uint256 timestamp;
        string name;
        string message;
    }
    // List of all the memos received
    Memo[] memos;
    //address of contract deployer
    address payable owner;
    
    constructor() {
        owner = payable(msg.sender);
    }

    /**S
        1) @dev Buy a coffee for contract owner
        2) @param _name name of coffee buyer
        3) @param _message message from coffee buyer
     */
    function buyCoffee(string memory _name, string memory _message) public payable {
        require(msg.value > 0,"You can't buy me a coffee with 0 Eth :() ");
        
        //Add the memo to storage
        memos.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        emit NewMemo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        );
    }
    /**
    @dev For sending tips from contract to owner
     */
    function withdrawTips() public {
        require(owner.send(address(this).balance));
    } 
     /**
    @dev retrieving all the memos and store on the blockchain
     */
    function getMemos() public view returns(Memo[] memory) {
        return memos;
    }

}