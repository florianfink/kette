"use strict";

const smartContractService = require("../modules/src/smartContractService");
const makeDepdenencies = require("./registryForUserDependencyMaker");

exports.makeRegister = (deps) => {

    if (!deps) deps = makeDepdenencies();

    const register = async function (uniqueAssetId, description, ipfsImageHash, apiKey, userId) {

        try {
            const { hasError, message } = checkInput(uniqueAssetId, description, ipfsImageHash, userId);
            if (hasError) return { hasError: true, message: "input error: " + message };

            const apiKeyMapping = await deps.apiKeyRepository.get(apiKey);
            const creatorId = apiKeyMapping.userId;

            const userRecord = await deps.getOrCreateUserRecord(userId, creatorId);

            const ownerEthAddress = userRecord.ethAddress;

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

    return register;
}

function checkInput(uniqueAssetId, description, ipfsImageHash, userId) {
    if (!ipfsImageHash) return { hasError: true, message: "ipfsImageHash missing" }
    if (!description) return { hasError: true, message: "description missing" }
    if (!uniqueAssetId) return { hasError: true, message: "uniqueAssetId missing" }
    if (!userId) return { hasError: true, message: "userId missing" }

    return { hasError: false }
}