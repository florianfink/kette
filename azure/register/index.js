"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const fetch = require("node-fetch");

const makeRegister = require("./modules/registry").makeRegister;
const cryptoFunctions = require("./modules/cryptoFunctions");

const makeCreateBlockchainRecord = require("./modules/tierionConnector").makeCreateBlockchainRecord;

const makeCreateUser = require("./modules/userManagement").makeCreateUser;

const makePublicRepository = require("./modules/publicRepository");
const makePrivateRepository = require("./modules/privateRepository");
const makeAquireToken = require("./modules/activeDirectoryAuthentication");

module.exports = async function (context, req) {

    const dependencies = makeDependencies(context);
    const register = makeRegister(dependencies);

    console.log(req.body);

    const result = await register(req.body);

    if (result.hasError) {
        context.res = {
            status: 400,
            body: result.message
        };
    } else {
        context.res = {
            status: 200,
            body: result
        };
    }
    //no context.done() because we return a promise (async). so the system handles calling context.done() for us
};

function makeDependencies(context) {
    return {
        cryptoFunctions: cryptoFunctions,
        createBlockchainRecord: makeCreateBlockchainRecord(secrets, fetch),
        createUser: makeCreateUser(makeAquireToken(secrets), fetch),
        publicRepository: makePublicRepository(context),
        privateRepository: makePrivateRepository(context)
    }
}
