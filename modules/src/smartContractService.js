const getConfig = require("./getConfig.js")
const HDWalletProvider = require('truffle-hdwallet-provider');
const web3 = require('web3');
const promisifyEvent = require('p-event');

exports.getRegistrationPrice = async function () {

    const {contract} = getContract();
    const priceInWei = await contract.methods.getCurrentRegistrationPrice().call();
    const priceInEth = web3.utils.fromWei(priceInWei, "ether");

    return { priceInWei, priceInEth };
}

exports.register = async function (uniqueAssetId, description, ipfsImageHash, ownerEthAddress) {

    const {contract, web3Instance} = getContract();

    const accounts = await web3Instance.eth.getAccounts();
    const contractOwnerAccount = accounts[0].toLowerCase();

    const priceInWei = await contract.methods.getCurrentRegistrationPrice().call();

    const transactionHash = await promisifyEvent(
        contract.methods.registerAssetFor(
            ipfsImageHash,
            description,
            uniqueAssetId,
            ownerEthAddress)
            .send({ from: contractOwnerAccount, gas: 3000000, value: priceInWei }),
        'transactionHash')

    return transactionHash;
}

exports.getBike = async function (uniqueId) {

    const {contract} = getContract();
    const bike = createGetBike(contract)(uniqueId);
    return bike;
}

exports.getBikes = async function (ethAddress) {

    const { contract } = getContract();

    const ids = await contract.methods.getTokenIds(ethAddress).call();

    const uniqueIdPromises = ids.map((id) => {
        return contract.methods.getUniqueIdForIndex(id).call();
    })

    const uniqueIds = await Promise.all(uniqueIdPromises);

    const bikePromises = uniqueIds.map((uniqueId) => {
        return createGetBike(contract)(uniqueId);
    })

    const bikes = await Promise.all(bikePromises);

    return bikes;
}

function getContract() {
    const { mnemonic, connectionString, contractAddress, contractAbi } = getConfig();
    const web3Instance = new web3(new HDWalletProvider(mnemonic, connectionString));
    const contract = new web3Instance.eth.Contract(contractAbi, contractAddress);
    return { contract, web3Instance }
}

function createGetBike(contract) {

    return async (uniqueId) => {
        const { ipfsImageHash_, description_ } = await contract.methods.getToken(uniqueId).call();

        if (ipfsImageHash_ && description_) {
            const bike = {
                description: description_,
                ipfsHash: ipfsImageHash_,
                uniqueId : uniqueId
            }
            return bike;
        }
    }
}