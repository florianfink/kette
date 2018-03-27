"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const fetch = require("node-fetch");


const registry = require("./modules/registry");
const cryptoFunctions = require("./modules/cryptoFunctions")
const tierionConnector = require("./modules/tierionConnector");
const userManagement = require("./modules/userManagement")

const makePublicRepository = require("./modules/publicRepository");
const makePrivateRepository = require("./modules/privateRepository");
const makeAquireToken = require("./modules/activeDirectoryAuthentication");

module.exports = async function (context, req) {

    const registrationData = checkInput(req.body);
    if (registrationData.isValid) {

        const opts = makeOptions(context);
        
        const result = await registry.register(registrationData, opts);

        context.res = {
            status: 200,
            body: result
        };
    }
    else {
        context.res = {
            status: 400,
            body: registrationData.message
        };
    }
    //no context.done() because we return a promise (async). so the system handles calling context.done() for us
};

function makeOptions(context) {
    return {
        cryptoFunctions: cryptoFunctions,
        tierionConnector: tierionConnector,
        userManagement : userManagement,
        publicRepository: makePublicRepository(context),
        privateRepository: makePrivateRepository(context),
        acquireToken : makeAquireToken(secrets),
        secrets: secrets,
        fetch: fetch
    }
}

function checkInput(input) {
    const frameNumber = input.frameNumber;
    const email = input.email;

    if (!frameNumber || !email) {
        return {
            isValid: false,
            message: "frameNumber or email is missing"
        }
    } else {
        return {
            frameNumber: frameNumber,
            email: email,
            isValid: true
        };
    }
}