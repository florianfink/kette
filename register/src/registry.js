"use strict";
const assert = require("assert");

exports.makeRegister = function (deps) {

    assert(deps.transactionRepository, "transactionRepository not set");
    assert(deps.userRecordRepository, "userRecordRepository not set");
    assert(deps.encryptionService, "encryption not set");
    assert(deps.cryptoFunctions, "cryptofunctions not set");
    assert(deps.createBlockchainRecord, "createBlockchainRecord not set");

    const register = async function (input) {

        try {
            const registrationData = exports.convertInput(input);
            if (registrationData.hasError) return { hasError: true, message: "input error: " + registrationData.message };

            const userRecord = await deps.userRecordRepository.get(registrationData.userId);
            if (!userRecord) return { hasError: true, message: "no key created for user: " + registrationData.userId };

            const privateKeyString = await deps.encryptionService.decrypt(userRecord.encryptedPrivateKey);
            const privateKeyBuffer = deps.cryptoFunctions.toPrivateKeyBuffer(privateKeyString);
            const ethAddress = userRecord.ethAddress;

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

            const blockchainRecord = await deps.createBlockchainRecord(signedMessage, registrationData.uniqueAssetId);

            const transaction = exports.createTransaction(registrationData.uniqueAssetId, registrationData.assetType, blockchainRecord, messageToSign.action, ethAddress, signedMessage);
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


exports.createTransaction = (uniqueAssetId, assetType, blockchainRecord, action, ethAddress, signedMessage) => {
    assert(uniqueAssetId, "asset type missing")
    assert(assetType, "uniqueAssetId missing")
    assert(action === "register", "only action register allowed")
    assert(blockchainRecord.status, "status missing")
    assert(blockchainRecord.date, "date missing")
    assert(signedMessage, "signedMessage missing")

    return {
        uniqueAssetId: uniqueAssetId,
        blockchainRecordId: blockchainRecord.id,
        assetType: assetType,
        action: action,
        ethAddress: ethAddress,
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