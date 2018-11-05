"use strict";

const makeApiKeyRepository = require("../modules/src/apiKeyRepository");
const makeDependenciesForCreateUserRecord = require("../users/src/userRecordCreatorDependencyMaker").makeDependencies;
const makeGetOrCreateUserRecord = require("../users/src/userRecordCreator").makeGetOrCreateUserRecord;
const AWS = require('aws-sdk');

const smartContractService = require("../modules/src/smartContractService");


exports.makeRegister = (apiKeyRepository, getOrCreateUserRecord) => {

    if (!apiKeyRepository) apiKeyRepository = createApiKeyRepository();
    if (!getOrCreateUserRecord) getOrCreateUserRecord = makeGetOrCreateUserRecord(makeDependenciesForCreateUserRecord());

    const register = async function (uniqueAssetId, description, ipfsImageHash, apiKey, userId) {

        try {
            const { hasError, message } = checkInput(uniqueAssetId, description, ipfsImageHash, userId);
            if (hasError) return { hasError: true, message: "input error: " + message };

            const apiKeyMapping = await apiKeyRepository.get(apiKey);
            const creatorId = apiKeyMapping.userId;

            const userRecord = await getOrCreateUserRecord(userId, creatorId);

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


function createApiKeyRepository() {
    if (process.env.IS_OFFLINE === 'true') {
        return makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' }))
    } else {
        return makeApiKeyRepository(new AWS.DynamoDB.DocumentClient())
    }
}