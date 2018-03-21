"use strict";

//set some dependencies --> better testability
exports.options = function(secrets, cryptoFunctions, tierionConnector){
    this.tierionConnector = tierionConnector;
    this.secrets = secrets;
    this.cryptoFunctions = cryptoFunctions;
}

exports.register = async function register(frameNumber) {
    if(!this.secrets) throw "secrets not set";
    if(!this.cryptoFunctions) throw "cryptoFunctions not set";
    if(!this.tierionConnector) throw "tierionConnector not set";

    try {
        //TODO: check public database for already registered bikes

        const key = this.cryptoFunctions.generateNewKey();

        const signingResult = this.cryptoFunctions.sign("Register bike with frameNumber: " + frameNumber, key.privateKey);

        const registerData = this.tierionConnector.createRegisterRequestData(this.secrets.dataStoreId, frameNumber, key.ethAddress, signingResult);
        const registerResult = await this.tierionConnector.registerBike(registerData);

        //TODO: create new user in User Management (Azure AD B2C)
        //TODO: save data to public database -> Name / FrameNumber / EthAddress
        //TODO: save data to private database --> userID, privateKey

        return registerResult;

    } catch (error) {
        console.error(error);
    }
}
