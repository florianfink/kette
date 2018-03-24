"use strict";

exports.register = async function register(registationData, opts) {
    if(!opts.secrets) throw "secrets not set";
    if(!opts.cryptoFunctions) throw "cryptoFunctions not set";
    if(!opts.tierionConnector) throw "tierionConnector not set";

    try {
        //TODO: check public database for already registered bikes

        const key = opts.cryptoFunctions.generateNewKey();

        const signingResult = opts.cryptoFunctions.sign("Register bike with frameNumber: " + registationData.frameNumber, key.privateKey);

        const registerRequest = opts.tierionConnector.createRegisterRequestData(opts.secrets.dataStoreId, registationData.frameNumber, key.ethAddress, signingResult);
        const registerResult = await opts.tierionConnector.registerBike(registerRequest, opts);

        //TODO: create new user in User Management (Azure AD B2C)
        await opts.publicRepository.save({frameNumber : registationData.frameNumber, address : key.ethAddress});
        //TODO: save data to private database --> userID, privateKey

        return registerResult;

    } catch (error) {
        return error;
    }
}
