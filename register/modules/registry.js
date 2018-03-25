"use strict";

exports.register = async function register(registationData, opts) {
    if (!opts.secrets) throw "secrets not set";
    if (!opts.cryptoFunctions) throw "cryptoFunctions not set";
    if (!opts.tierionConnector) throw "tierionConnector not set";

    try {
        const exisitingRegistration = await opts.publicRepository.find(registationData.frameNumber);
        if(exisitingRegistration){
            //TODO proper errorhandling
            return "already registered to: " + exisitingRegistration.address;
        }

        const key = opts.cryptoFunctions.generateNewKey();

        const signingResult = opts.cryptoFunctions.sign("Register bike with frameNumber: " + registationData.frameNumber, key.privateKey);

        const registerRequest = opts.tierionConnector.createRegisterRequestData(opts.secrets.dataStoreId, registationData.frameNumber, key.ethAddress, signingResult);
        const registerResult = await opts.tierionConnector.registerBike(registerRequest, opts);

        //TODO: create new user in User Management (Azure AD B2C)
        await opts.publicRepository.save({ frameNumber: registationData.frameNumber, address: key.ethAddress });
        //TODO: use userId, not e-mail if possible
        await opts.privateRepository.save({ email: registationData.email, privateKey: key.privateKeyString })

        return "yolo";

    } catch (error) {
        return error;
    }
}
