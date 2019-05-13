"use strict";

const smartContractService = require("../../modules/smartContractService");
const creditCardService = require("./creditCardService");
const priceService = require("../../price/priceService")

exports.register = async function (vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress, stripeToken) {

    try {
        const { hasError, message } = checkInput(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress, stripeToken);
        if (hasError) return { hasError: true, message: "input error: " + message };

        const { priceInCents } = await priceService.getPrice();
        await creditCardService.charge(priceInCents, stripeToken);

        const transactionHash = await smartContractService.register(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress);

        return transactionHash;

    } catch (error) {
        console.log("error: " + error);
        return {
            hasError: true,
            message: error
        };
    }
}

function checkInput(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress, stripeToken) {

    if (!vendor) return { hasError: true, message: "vendor missing" }
    if (!serialNumber) return { hasError: true, message: "serialNumber missing" }
    if (!frameNumber) return { hasError: true, message: "frameNumber missing" }
    if (!ipfsImageHash) return { hasError: true, message: "ipfsImageHash missing" }
    if (!stripeToken) return { hasError: true, message: "stripeToken missing" }
    if (!ownerEthAddress) return { hasError: true, message: "ownerEthAddress missing" }

    return { hasError: false }
}