"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const fetch = require("node-fetch");

const registry = require("./modules/registry");
const cryptoFunctions = require("./modules/cryptoFunctions")
const tierionConnector = require("./modules/tierionConnector");

tierionConnector.options(fetch, secrets);
registry.options(secrets, cryptoFunctions, tierionConnector);


module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    if (req.body.frameNumber) {
        
        var result = await registry.register(req.body.frameNumber);
        console.log(result);
        
        context.res = {
            status: 200,
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