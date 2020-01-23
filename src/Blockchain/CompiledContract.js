const abi = [
    {
        "constant": false,
        "inputs": [{ "name": "key", "type": "string" }, { "name": "value", "type": "string" }], "name": "addAssociation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    },
    {
        "constant": false,
        "inputs": [{ "name": "key", "type": "string" }, { "name": "value", "type": "string" }], "name": "modifyAssoc", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function"
    },
    {
        "constant": true,
        "inputs": [{ "name": "key", "type": "string" }], "name": "getAssoc", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function"
    },
    { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }
];
export default abi;