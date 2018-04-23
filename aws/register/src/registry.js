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
            const registrationData = convert(input);
            if (registrationData.hasError) return { hasError: true, message: "input error: " + registrationData.message }; //EXIT CHECK

            const exisitingRegistrations = await deps.publicRepository.find(registrationData.uniqueAssetIdentifier);
            if (exisitingRegistrations.length > 0) return { hasError: true, message: "already registered" }; //EXIT CHECK

            const createUserResult = await deps.createUser(registrationData.userInformation);
            if (createUserResult.hasError) return { hasError: true, message: "create user failed: " + createUserResult.message }; //EXIT CHECK
            // end checks

            const key = deps.cryptoFunctions.generateNewKey();

            const messageToSign = {
                action: "register",
                assetType: registrationData.assetType,
                uniqueId: registrationData.uniqueAssetIdentifier
            }

            const signedMessage = deps.cryptoFunctions.sign(JSON.stringify(messageToSign), key.privateKey);

            const blockchainRecord = await deps.createBlockchainRecord(signedMessage);

            const publicRecord = {
                assetType: registrationData.assetType,
                uniqueAssetId: registrationData.uniqueAssetIdentifier,
                history: [
                    {
                        action: messageToSign.action,
                        address: key.ethAddress,
                        blockchainRecordId: blockchainRecord.id,
                        status: blockchainRecord.status,
                        timestamp: blockchainRecord.timestamp,
                    }
                ],
            }

            await deps.publicRepository.save(publicRecord);

            //todo: encrypt private key
            const userRecord = {
                userId: createUserResult.userId,
                privateKey: key.privateKeyString,
                assets: [
                    {
                        uniqueAssetId: registrationData.uniqueAssetIdentifier
                    }
                ]
            };

            await deps.privateRepository.save(userRecord);

            //TODO: return other value yo.
            return publicRecord;

        } catch (error) {
            return {
                hasError: true,
                message: error
            };
        }
    }
    return register;
}


function convert(input) {

    if (!input) {
        return {
            hasError: true,
            message: "no input"
        }
    }

    if (!input.uniqueAssetIdentifier) return { hasError: true, message: "uniqueAssetIdentifier missing" }
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
        uniqueAssetIdentifier: input.uniqueAssetIdentifier,
        assetType: input.assetType,
        userInformation: {
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            address: input.street + " " + input.zipcode + " " + input.city + " " + input.country
        }
    };
}