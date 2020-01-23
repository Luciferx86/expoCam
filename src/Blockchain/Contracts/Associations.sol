pragma solidity >=0.4.24;
contract Associations {
    mapping (string => string) assocs ;
    constructor() public {
        assocs['0'] = '0';
    }
    function addAssoc(string memory key, string memory value) public {
        assocs[key] = value;
    }
    function getAssoc(string memory key) public view returns(string memory){
        return assocs[key];
    }

    function modifyAssoc(string memory key, string memory value) public{
        assocs[key] = value;
    }
}