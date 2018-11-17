"use strict";

const registryContractInfo = require("../../contract/BicycleRegistryPublish.json");
const secrets = require("../../secrets");

module.exports = () => {

    let mnemonic;
    let connectionString;
    let contractAddress;
    if (process.env.IS_OFFLINE === "true") {
        mnemonic = "kette";
        connectionString = "http://localhost:8545";
        contractAddress = registryContractInfo.networks["666"].address;
    } else {
        mnemonic = secrets.mnemonic;
        connectionString = "https://rinkeby.infura.io/v3/" + secrets.infuraKey;
        contractAddress = registryContractInfo.networks["4"].address;
    }
    const contractAbi = registryContractInfo.abi;

    return { mnemonic, connectionString, contractAddress, contractAbi };
}