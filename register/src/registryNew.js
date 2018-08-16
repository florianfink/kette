"use strict";
const createUniqueId = require("uuid").v1;
const assert = require("assert");

exports.makeRegister = function (deps) {

    assert(deps.apiKeyRepository, "apiKeyRepository not set");
    assert(deps.transactionRepository, "transactionRepository not set");
    assert(deps.userRecordRepository, "userRecordRepository not set");

    assert(deps.encryptionService, "encryption not set");
    assert(deps.cryptoFunctions, "cryptofunctions not set");
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

            const userRecord = await deps.userRecordRepository.get(registrationData.userId);
            if (userRecord) {
                const privateKeyString = await deps.encryptionService.decrypt(userRecord.encryptedPrivateKey);
                privateKeyBuffer = deps.cryptoFunctions.toPrivateKeyBuffer(privateKeyString);
                ethAddress = userRecord.ethAddress;
            }
            else {
                const key = deps.cryptoFunctions.generateNewKey();
                privateKeyBuffer = key.privateKey;
                ethAddress = key.ethAddress;

                const privateKeyString = key.privateKeyString;
                const encryptedPrivateKey = await deps.encryptionService.encrypt(privateKeyString);
                const userRecord = createUserRecord(registrationData.userId, key.ethAddress, encryptedPrivateKey, apiKeyMapping.userId);
                await deps.userRecordRepository.save(userRecord);
            }

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
    assert(userId, "[create user record] -> userId missing")
    assert(ethAddress, "[create user record] -> ethAddress missing")
    assert(encryptedPrivateKey, "[create user record] -> encryptedPrivateKey missing")
    assert(creatorId, "[create user record] -> creatorId missing")

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
    if (!input.userId) return { hasError: true, message: "userId missing" }

    return {
        uniqueAssetId: input.uniqueAssetId,
        assetType: input.assetType,
        userId: input.userId
    };
}