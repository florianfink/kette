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
            //start checks 
            const registrationData = convert(input);
            if (registrationData.hasError) return { hasError: true, message: "input error: " + registrationData.message }; //EXIT CHECK

            const exisitingRegistrations = await deps.transactionRepository.findByUniqueAssetId(registrationData.uniqueAssetId);
            if (exisitingRegistrations.length > 0) return { hasError: true, message: "asset already registered: " + registrationData.uniqueAssetId }; //EXIT CHECK

            const createUserResult = await deps.createUser(registrationData.userInformation);
            if (createUserResult.hasError) return { hasError: true, message: "create user failed: " + createUserResult.message }; //EXIT CHECK
            // end checks

            const key = deps.cryptoFunctions.generateNewKey();

            const messageToSign = {
                action: "register",
                assetType: registrationData.assetType,
                uniqueAssetId: registrationData.uniqueAssetId
            }

            const signedMessage = deps.cryptoFunctions.sign(JSON.stringify(messageToSign), key.privateKey);

            const id = createUniqueId();

            const blockchainRecord = await deps.createBlockchainRecord(signedMessage, id);

            const transaction = createTransaction(id, registrationData, blockchainRecord, messageToSign.action, key.ethAddress, signedMessage);

            await deps.transactionRepository.save(transaction);

            const encryptedPrivateKey = await deps.encryptionService.encrypt(key.privateKeyString);

            const apiKeyMapping = await deps.apiKeyRepository.get(apiKey);
            const userRecord = createUserRecord(createUserResult.userId, key.ethAddress, encryptedPrivateKey, apiKeyMapping.userId);
            await deps.privateRepository.save(userRecord);

            return transaction;

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

function createTransaction(id, registrationData, blockchainRecord, action, ethAddress, signedMessage) {
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
        date: blockchainRecord.date,
        signedMessage: signedMessage
    }
}

function convert(input) {

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