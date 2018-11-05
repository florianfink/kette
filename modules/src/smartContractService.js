const getConfig = require("./getConfig.js")
const HDWalletProvider = require('truffle-hdwallet-provider');
const web3 = require('web3');
const promisifyEvent = require('p-event');

exports.getRegistrationPrice = async function () {

    const { mnemonic, connectionString, contractAddress, contractAbi } = getConfig();
    const web3Instance = new web3(new HDWalletProvider(mnemonic, connectionString));
    const registryContract = new web3Instance.eth.Contract(contractAbi, contractAddress);

    const priceInWei = await registryContract.methods.getCurrentRegistrationPrice().call();
    const priceInEth = web3.utils.fromWei(priceInWei, "ether");

    return { priceInWei, priceInEth };
}

exports.register = async function (uniqueAssetId, description, ipfsImageHash, ownerEthAddress) {

    const { mnemonic, connectionString, contractAddress, contractAbi } = getConfig();
    const web3Instance = new web3(new HDWalletProvider(mnemonic, connectionString));
    const registryContract = new web3Instance.eth.Contract(contractAbi, contractAddress);

    const accounts = await web3Instance.eth.getAccounts();
    const contractOwnerAccount = accounts[0].toLowerCase();

    const priceInWei = await registryContract.methods.getCurrentRegistrationPrice().call();

    const transactionHash = await promisifyEvent(
        registryContract.methods.registerAssetFor(
            ipfsImageHash,
            description,
            uniqueAssetId,
            ownerEthAddress)
            .send({ from: contractOwnerAccount, gas: 3000000, value: priceInWei }),
        'transactionHash')

    return transactionHash;
}