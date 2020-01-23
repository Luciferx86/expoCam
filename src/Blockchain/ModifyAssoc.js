const contract = require('./Build/Associations.json');

const ethers = require('ethers');
const Web3 = require('web3');


const addToBlockChain = async () => {

    let privateKey = '04F0F4ED3448E19166411D76D81A8970DDCCCBB6DD4192345222821F8948A5A0';
    // console.log(this.getFileName());
    // console.log(contractAddress.default);

    let USER = "u0orvqr0d3";
    let PASS = "uZqPJU9KAwgur3izFFMykAJy-6QM4fYwr3C8JACnOnI";
    let url = 'https://u0ymjsceop-u0gepxa7q7-rpc.us0-aws.kaleido.io';

    const details = {
        user: USER,
        password: PASS,
        url: url
    };

    // let url = "https://" + USER + ":" + PASS + "@" + RPC_ENDPOINT;
    // let provider = new Web3.providers.HttpProvider(url);

    let abi = contract.interface;
    // let provider = new ethers.providers.InfuraProvider('rinkeby');
    let provider = new ethers.providers.JsonRpcProvider(details);
    // let pro = new ethers.providers.Web3Provider(provider);
    let wallet = new ethers.Wallet(privateKey, provider);
    let contractAddress = '0x5fe51dae55e1d05a2c90fca1e88c8d758cebb7ae';
    // let contractAddress = '0x5c8Fd2269976953272c4057dcBe2b354AB1AD2Bd';
    let deployedContract = new ethers.Contract(contractAddress, abi, wallet);

    // const ok = await deployedContract.addAssoc('getThis', 'Signature: ' + 'thisDone');
    const ok = await deployedContract.getAssoc('a93602d8-20fc-4961-b232-f9b1ee474005.mp4');
    console.log(ok);
}

addToBlockChain().then(() => {
}).catch((err) => {
    console.log(err);
});