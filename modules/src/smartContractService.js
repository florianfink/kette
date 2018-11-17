const getConfig = require("./getConfig.js")
const HDWalletProvider = require('truffle-hdwallet-provider');
const web3 = require('web3');
const promisifyEvent = require('p-event');

exports.getRegistrationPrice = async function () {

    const { contract } = getContract();
    const priceInWei = await contract.methods.getCurrentRegistrationPrice().call();
    const priceInEth = web3.utils.fromWei(priceInWei, "ether");

    return { priceInWei, priceInEth };
}

exports.register = async function (vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress) {

    const { contract, web3Instance } = getContract();

    const accounts = await web3Instance.eth.getAccounts();
    const contractOwnerAccount = accounts[0].toLowerCase();

    const priceInWei = await contract.methods.getCurrentRegistrationPrice().call();

    const transactionHash = await promisifyEvent(
        contract.methods.registerBicycleFor(
            vendor,
            serialNumber,
            frameNumber,
            ipfsImageHash,
            ownerEthAddress)
            .send({ from: contractOwnerAccount, gas: 3000000, value: priceInWei }),
        'transactionHash')

    return transactionHash;
}

exports.lookUpBicycle = async function (vendor, serialNumber, frameNumber) {

    const { contract } = getContract();
    const bike = createLookUpBike(contract)(vendor, serialNumber, frameNumber);
    return bike;
}

exports.getBikes = async function (ethAddress) {

    const { contract } = getContract();

    const uniqueIds = await contract.methods.getTokenIds(ethAddress).call();

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

        const {vendor_, serialNumber_, frameNumber_, ipfsImageHash_, state_, uniqueId_} = await contract.methods.getBicycle(uniqueId).call();

        if (vendor_ && serialNumber_ && frameNumber_ && ipfsImageHash_ && state_ && uniqueId_) {
            const bike = {
                vendor : vendor_,
                serialNumber : serialNumber_,
                frameNumber : frameNumber_,
                ipfsImageHash: ipfsImageHash_,
                state: mapState(state_),
                uniqueId : uniqueId_
            }
            return bike;
        }
    }
}

function createLookUpBike(contract) {

    return async (vendor, serialNumber, frameNumber) => {

        const {vendor_, serialNumber_, frameNumber_, ipfsImageHash_, state_, uniqueId_} = await contract.methods.lookUpBicycle(vendor, serialNumber, frameNumber).call();

        if (vendor_ && serialNumber_ && frameNumber_ && ipfsImageHash_ && state_ && uniqueId_) {
            const bike = {
                vendor : vendor_,
                serialNumber : serialNumber_,
                frameNumber : frameNumber_,
                ipfsImageHash: ipfsImageHash_,
                state: mapState(state_),
                uniqueId : uniqueId_
            }
            return bike;
        }
    }
}

function mapState(state){
    switch(state){
        case '0' : return "ok";
        case '1' : return "stolen";
        case '2' : return "lost";
    }
}