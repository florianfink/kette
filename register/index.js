"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const fetch = require("node-fetch");

const makeRegister = require("./modules/registry");
const cryptoFunctions = require("./modules/cryptoFunctions");

const makeCreateBlockchainRecord = require("./modules/tierionConnector").makeCreateBlockchainRecord;

const makeCreateUser = require("./modules/userManagement").makeCreateUser;

const makePublicRepository = require("./modules/publicRepository");
const makePrivateRepository = require("./modules/privateRepository");
const makeAquireToken = require("./modules/activeDirectoryAuthentication");

module.exports = async function (context, req) {

    const registrationData = checkInput(req.body);
    if (registrationData.hasError) {
        context.res = {
            status: 400,
            body: registrationData.message
        };
    }
    else {
        const dependencies = makeDependencies(context); 
        const register = makeRegister(dependencies);
        
        const result = await register(registrationData);

        context.res = {
            status: 200,
            body: result
        };
    }
    //no context.done() because we return a promise (async). so the system handles calling context.done() for us
};

function makeDependencies(context) {
    return {
        cryptoFunctions : cryptoFunctions,
        createBlockchainRecord: makeCreateBlockchainRecord(secrets, fetch),
        createUser: makeCreateUser(makeAquireToken(secrets), fetch),
        publicRepository: makePublicRepository(context),
        privateRepository: makePrivateRepository(context)
    }
}

function checkInput(input) {
    if (!input.frameNumber || !input.email) {
        return {
            hasError: true,
            message: "frameNumber or email is missing"
        }
    } else return input;
}