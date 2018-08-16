"use strict";
const createUniqueId = require("uuid").v1;
const assert = require("assert");

exports.makeRegister = function (deps) {

    assert(deps.apiKeyRepository, "apiKeyRepository not set");
    assert(deps.encryptionService, "encryption not set");
    assert(deps.cryptoFunctions, "cryptofunctions not set");
    assert(deps.transactionRepository, "transactionRepository not set");
    assert(deps.privateRepository, "privateRepository not set");
    assert(deps.createUser, "createUser not set");
    assert(deps.createBlockchainRecord, "createBlockchainRecord not set");

    const register = async function (input, apiKey) {
        assert(apiKey, "no apiKey");

        try {
            const registrationData = exports.convertInput(input);
            if (registrationData.hasError) return { hasError: true, message: "input error: " + registrationData.message };

            const apiKeyMapping = await deps.apiKeyRepository.get(apiKey);
            if (!apiKeyMapping) return { hasError: true, message: "api key not linked with any valid B2B user" };

            let privateKeyBuffer;
            let ethAddress;
            // create user
            const createUserResult = await deps.createUser(registrationData.userInformation);
            if (createUserResult.hasError) return { hasError: true, message: "create user failed: " + createUserResult.message };

            const key = deps.cryptoFunctions.generateNewKey();
            const encryptedPrivateKey = await deps.encryptionService.encrypt(key.privateKeyString);

            const userRecord = createUserRecord(createUserResult.userId, key.ethAddress, encryptedPrivateKey, apiKeyMapping.userId);
            await deps.privateRepository.save(userRecord);

            privateKeyBuffer = key.privateKey;
            ethAddress = key.ethAddress;
            // end create user

            // sign message
            const messageToSign = {
                action: "register",
                assetType: registrationData.assetType,
                uniqueAssetId: registrationData.uniqueAssetId
            }
            const signedMessage = deps.cryptoFunctions.sign(JSON.stringify(messageToSign), privateKeyBuffer);
            // end sign message

            //create transaction
            const exisitingRegistrations = await deps.transactionRepository.findByUniqueAssetId(registrationData.uniqueAssetId);
            if (exisitingRegistrations.length > 0) return { hasError: true, message: "asset already registered: " + registrationData.uniqueAssetId };

            const id = createUniqueId();
            const blockchainRecord = await deps.createBlockchainRecord(signedMessage, id);

            const transaction = exports.createTransaction(id, registrationData, blockchainRecord, messageToSign.action, ethAddress, signedMessage);
            await deps.transactionRepository.save(transaction);
            return transaction;
            //end create transaction

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

function createUserRecord(userId, ethAddress, encryptedPrivateKey, creatorId) {
    assert(userId, "userId missing")
    assert(ethAddress, "ethAddress missing")
    assert(encryptedPrivateKey, "encryptedPrivateKey missing")
    assert(creatorId, "creatorId missing")

    const userRecord = {
        userId: userId,
        ethAddress: ethAddress,
        encryptedPrivateKey: encryptedPrivateKey,
        creatorId: creatorId,
    };

    return userRecord;
}

exports.createTransaction = (id, registrationData, blockchainRecord, action, ethAddress, signedMessage) => {
    assert(id, "id missing")
    assert(registrationData.assetType, "asset type missing")
    assert(registrationData.uniqueAssetId, "uniqueAssetId missing")
    assert(action === "register", "only action register allowed")
    assert(blockchainRecord.status, "status missing")
    assert(blockchainRecord.date, "date missing")
    assert(signedMessage, "signedMessage missing")

    return {
        id: id,
        assetType: registrationData.assetType,
        uniqueAssetId: registrationData.uniqueAssetId,
        action: action,
        ethAddress: ethAddress,
        blockchainRecordId: blockchainRecord.id,
        status: blockchainRecord.status,
        date: blockchainRecord.date.toISOString(),
        signedMessage: signedMessage
    }
}

exports.convertInput = (input) => {

    if (!input) {
        return {
            hasError: true,
            message: "no input"
        }
    }

    if (!input.uniqueAssetId) return { hasError: true, message: "uniqueAssetId missing" }
    if (!input.assetType) return { hasError: true, message: "assetType missing" }
    if (input.assetType != 'bicycle') return { hasError: true, message: "only bicycle allowed for assetType but was: " + input.assetType }
    if (!input.firstName) return { hasError: true, message: "firstName missing" }
    if (!input.lastName) return { hasError: true, message: "lastName missing" }
    if (!input.street) return { hasError: true, message: "street missing" }
    if (!input.zipcode) return { hasError: true, message: "zipcode missing" }
    if (!input.city) return { hasError: true, message: "city missing" }
    if (!input.country) return { hasError: true, message: "country missing" }
    if (!input.email) return { hasError: true, message: "email missing" }

    return {
        uniqueAssetId: input.uniqueAssetId,
        assetType: input.assetType,
        userInformation: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            address: input.street + " " + input.zipcode + " " + input.city + " " + input.country
        }
    };
}