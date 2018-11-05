"use strict";

const registry = require("./registry");
const creditCardService = require("./creditCardService");
const priceService = require("../price/priceService")

exports.register = async function (uniqueAssetId, description, ipfsImageHash, ownerEthAddress, stripeToken) {

    try {
        const { hasError, message } = checkInput(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);
        if (hasError) return { hasError: true, message: "input error: " + message };

        const { priceInCents } = await priceService.getPrice();
        await creditCardService.charge(priceInCents, stripeToken);

        const transactionHash = await registry.register(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);

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