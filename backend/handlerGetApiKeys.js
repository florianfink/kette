/*
*    B2B endpoint for creators to create their api key to use the register function
*/

"use strict";

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const awsHelper = require("./modules/src/awsHelper");
const secrets = require("./secrets");
const config = require("./config");
const AWS = require('aws-sdk');

module.exports.getApiKeys = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    const deps = makeDependencies();

    const userId = deps.extractUserId(cognitoAuthenticationProvider);
    const apiKeys = await deps.apiKeyRepository.findByUserId(userId);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(apiKeys)
    }
    callback(null, response);
}

function makeDependencies() {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeRealDependencies() {
    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })),
        extractUserId: awsHelper.extractUserId
    }
}

function makeMockDependencies() {

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        extractUserId: () => { return "B2B-user-called-creator" }
    }
}
