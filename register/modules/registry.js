"use strict";

const tierion = require("./tierionConnector");

//set some dependencies --> better testability
exports.options = function(fetch, secrets){
    this.secrets = secrets;
    tierion.options(fetch, secrets);
}

exports.registerBike = async function (frameNumber, publicKey, message) {
    if(!this.secrets) throw "secrets not set";

    //TODO: check if registration is possible

    var registerData = tierion.createRegisterRequestData(this.secrets.dataStoreId, frameNumber, publicKey, message);
    var registerResult = await tierion.registerBike(registerData);

    //TODO: save data to velochain database -> Name / FrameNumber / EthAddress

    return registerResult;
}

