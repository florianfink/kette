"use strict";

const smartContractService = require("../modules/smartContractService");
const makeDepdenencies = require("./registryForUserDependencyMaker");

exports.makeRegister = (deps) => {

    if (!deps) deps = makeDepdenencies();

    const register = async function (vendor, serialNumber, frameNumber, ipfsImageHash, apiKey, userId) {

        try {
            const { hasError, message } = checkInput(vendor, serialNumber, frameNumber, ipfsImageHash, apiKey, userId);
            if (hasError) return { hasError: true, message: "input error: " + message };

            const apiKeyMapping = await deps.apiKeyRepository.get(apiKey);
            const creatorId = apiKeyMapping.userId;

            const userRecord = await deps.getOrCreateUserRecord(userId, creatorId);

            const ownerEthAddress = userRecord.ethAddress;

            const transactionHash = smartContractService.register(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress);

            return transactionHash;

        } catch (error) {
            console.log("error: " + error);
            return {
                hasError: true,
                message: error
            };
        }
    }

    return register;
}

function checkInput(vendor, serialNumber, frameNumber, ipfsImageHash, apiKey, userId) {

    if (!vendor) return { hasError: true, message: "vendor missing" }
    if (!serialNumber) return { hasError: true, message: "serialNumber missing" }
    if (!frameNumber) return { hasError: true, message: "frameNumber missing" }
    if (!ipfsImageHash) return { hasError: true, message: "ipfsImageHash missing" }
    if (!apiKey) return { hasError: true, message: "apiKey missing" }
    if (!userId) return { hasError: true, message: "userId missing" }

    return { hasError: false }
}