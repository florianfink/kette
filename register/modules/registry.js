"use strict";

const assert = require("assert");

exports.makeRegister = function (deps) {

    assert(deps.cryptoFunctions, "cryptofunctions not set");
    assert(deps.publicRepository, "publicRepository not set");
    assert(deps.privateRepository, "privateRepository not set");
    assert(deps.createUser, "createUser not set");
    assert(deps.createBlockchainRecord, "createBlockchainRecord not set");

    const register = async function (input) {

        try {
            //start checks 
            const registrationData = checkInput(input);
            if (registrationData.hasError) return { hasError: true, message: "input error: " + registrationData.message }; //EXIT CHECK

            const exisitingRegistration = await deps.publicRepository.find(registrationData.frameNumber);
            if (exisitingRegistration) return { hasError: true, message: "already registered to: " + exisitingRegistration.address }; //EXIT CHECK

            const createUserResult = await deps.createUser(registrationData.userInformation);
            if (createUserResult.hasError) return { hasError: true, message: "create user failed: " + createUserResult.message }; //EXIT CHECK
            // end checks

            const key = deps.cryptoFunctions.generateNewKey();

            const messageToSign = {
                action: "register",
                assetType: "bicycle",
                uniqueId: registrationData.frameNumber
            }

            const signedMessage = deps.cryptoFunctions.sign(JSON.stringify(messageToSign), key.privateKey);

            const blockchainRecord = await deps.createBlockchainRecord(signedMessage);

            await deps.publicRepository.save({ blockchainRecordId: blockchainRecord.id, frameNumber: registrationData.frameNumber, address: key.ethAddress });

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


function checkInput(input) {
    

    if (!input) {
        return {
            hasError: true,
            message: "no input"
        }
    }

    if (!input.frameNumber) return { hasError: true, message: "frameNumber missing" }
    if (!input.email) return { hasError: true, message: "email missing" }
    if (!input.firstName) return { hasError: true, message: "firstName missing" }
    if (!input.lastName) return { hasError: true, message: "lastName missing" }

    return {
        frameNumber: input.frameNumber,
        userInformation: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName
        }
    };
}