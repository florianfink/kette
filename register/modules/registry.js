"use strict";

exports.register = async function register(registrationData, opts) {
    if (!opts.secrets) throw "secrets not set";
    if (!opts.cryptoFunctions) throw "cryptoFunctions not set";
    if (!opts.tierionConnector) throw "tierionConnector not set";

    try {
        const exisitingRegistration = await opts.publicRepository.find(registrationData.frameNumber);
        if (exisitingRegistration) {
            //TODO proper errorhandling
            return "already registered to: " + exisitingRegistration.address;
        }

        const createUserResult = await opts.userManagement.createUser({ email: registrationData.email }, opts);

        const userCreationError = createUserResult["odata.error"];
        if (userCreationError) {
            return userCreationError.message.value;
        }

        const key = opts.cryptoFunctions.generateNewKey();

        //add "action" to message
        const signingResult = opts.cryptoFunctions.sign("Register bike with frameNumber: " + registrationData.frameNumber, key.privateKey);

        const registerRequest = opts.tierionConnector.createRegisterRequestData(opts.secrets.dataStoreId, registrationData.frameNumber, key.ethAddress, signingResult);
        const registerResult = await opts.tierionConnector.registerBike(registerRequest, opts);

        await opts.publicRepository.save({ frameNumber: registrationData.frameNumber, address: key.ethAddress });

        await opts.privateRepository.save({ userId: createUserResult.objectId, privateKey: key.privateKeyString })

        return {
            blockchainId: registerResult.id,
            blockchainMessage: JSON.parse(registerResult.data.message),
            timestamp: registerResult.timestamp,
            status: registerResult.status
        };

    } catch (error) {
        return error;
    }
}
