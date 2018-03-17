"use strict";

const fetch = require("node-fetch");
const secrets = require("./secrets");
var registry = require("./modules/registry");
registry.options(fetch,secrets);
const cryptoFunctions = require("./modules/cryptoFunctions")

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body.frameNumber) {
        
        var result = await register(req.body.frameNumber);
        console.log(result);
        
        context.res = {
            // status: 200, /* Defaults to 200 */
            body: result
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a frameNumber in the request body"
        };
    }
    context.done();
};

async function register(frameNumber) {

    try {
        var privateKey = cryptoFunctions.generatePrivateKey();
        var publicKey = cryptoFunctions.getPublicKey(privateKey);
        var address = cryptoFunctions.getAddressFromPublicKey(publicKey);
        var addressAsString = cryptoFunctions.getAddressString(address);

        var signingResult = cryptoFunctions.sign("Register bike with frameNumber: " + frameNumber, privateKey);

        //var cosignedMessage = cryptoFunctions.sign(signingResult.sig, cosignersPrivateKey);
        var result = await registry.registerBike(frameNumber, addressAsString, signingResult);
        return result;

    } catch (error) {
        console.error(error);
    }
}