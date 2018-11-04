const getConfig = require("../modules/src/getConfig.js")
const HDWalletProvider = require('truffle-hdwallet-provider');
const web3 = require('web3');
const promisifyEvent = require('p-event');

const blockchainService = require('myService');

exports.register = async function (input) {

    try {
        const { ipfsImageHash, description, uniqueAssetId, ownerEthAddress, hasError, message } = checkInput(input);
        if (hasError) return { hasError: true, message: "input error: " + message };

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

    } catch (error) {
        console.log("error: " + error);
        return {
            hasError: true,
            message: error
        };
    }
}

checkInput = (input) => {

    if (!input) {
        return {
            hasError: true,
            message: "no input"
        }
    }

    if (!input.uniqueAssetId) return { hasError: true, message: "uniqueAssetId missing" }
    if (!input.ipfsImageHash) return { hasError: true, message: "ipfsImageHash missing" }
    if (!input.description) return { hasError: true, message: "description missing" }
    if (!input.ownerEthAddress) return { hasError: true, message: "ownerEthAddress missing" }

    return input;
}