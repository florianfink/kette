"use strict";

const smartContractService = require("../modules/src/smartContractService");

exports.register = async function (uniqueAssetId, description, ipfsImageHash, ownerEthAddress) {

    try {
        const { hasError, message } = checkInput(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);
        if (hasError) return { hasError: true, message: "input error: " + message };

        //TODO: check if ipfsImageHash exists.
        //TODO: check for valid ownerEthAddress
        const transactionHash = smartContractService.register(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);

        return transactionHash;

    } catch (error) {
        console.log("error: " + error);
        return {
            hasError: true,
            message: error
        };
    }
}

function checkInput(uniqueAssetId, description, ipfsImageHash, ownerEthAddress) {
    if (!ipfsImageHash) return { hasError: true, message: "ipfsImageHash missing" }
    if (!description) return { hasError: true, message: "description missing" }
    if (!uniqueAssetId) return { hasError: true, message: "uniqueAssetId missing" }
    if (!ownerEthAddress) return { hasError: true, message: "ownerEthAddress missing" }

    return { hasError: false }
}