"use strict";

const assert = require("assert");

exports.makeRegister = function (deps) {

    assert(deps.cryptoFunctions, "cryptofunctions not set");
    assert(deps.publicRepository, "publicRepository not set");
    assert(deps.privateRepository, "privateRepository not set");
    assert(deps.createUser, "createUser not set");
    assert(deps.createBlockchainRecord, "createBlockchainRecord not set");

    const register = async function (registrationData) {

        try {
            const exisitingRegistration = await deps.publicRepository.find(registrationData.frameNumber);
            if (exisitingRegistration) return "already registered to: " + exisitingRegistration.address; //EXIT CHECK

            const createUserResult = await deps.createUser({ email: registrationData.email });
            if (createUserResult.hasError) return createUserResult.message; //EXIT CHECK

            const key = deps.cryptoFunctions.generateNewKey();

            const messageToSign = {
                action: "register",
                assetType: "bike",
                uniqueId: registrationData.frameNumber
            }

            const signedMessage = deps.cryptoFunctions.sign(JSON.stringify(messageToSign), key.privateKey);

            const blockchainRecord = await deps.createBlockchainRecord(signedMessage);

            await deps.publicRepository.save({ tierion_record_id: blockchainRecord.id, frameNumber: registrationData.frameNumber, address: key.ethAddress });

            //todo: encrypt private key
            await deps.privateRepository.save({ userId: createUserResult.objectId, privateKey: key.privateKeyString });

            return {
                blockchainId: blockchainRecord.id,
                blockchainMessage: JSON.parse(blockchainRecord.data.message),
                timestamp: blockchainRecord.timestamp,
                status: blockchainRecord.status
            };

        } catch (error) {
            return error;
        }
    }
    return register;
}