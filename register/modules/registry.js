"use strict";

exports.register = async function register(registrationData, deps) {
    if (!deps.cryptoFunctions) throw "cryptoFunctions not set";
    if (!deps.tierionConnector) throw "tierionConnector not set";

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

        await deps.publicRepository.save({ frameNumber: registrationData.frameNumber, address: key.ethAddress });

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
