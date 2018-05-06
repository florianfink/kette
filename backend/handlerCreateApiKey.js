/*
*    B2B endpoint for creators to create their api key to use the register function
*/

"use strict";

const makeCreateApiKey = require("./apiKeys/src/apiKeyCreation").makeCreateApiKey;

const makeInternalCreateApiKey = require("./apiKeys/src/apiKeyManagement").makeInternalCreateApiKey;
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const secrets = require("./secrets");
const config = require("./config");
const AWS = require('aws-sdk');

module.exports.createApiKey = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;

    const createApiKey = makeCreateApiKey(makeDependencies());

    const result = await createApiKey(cognitoAuthenticationProvider);

    if (result.hasError) {
        const response = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            statusCode: 400,
            body: JSON.stringify(result.message)
        }
        callback(null, response);
    }
    else {
        const response = {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Credentials": true
            },
            statusCode: 200,
            body: JSON.stringify({ apiKey: result.apiKey })
        };
        callback(null, response);
    }
}


function makeDependencies() {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeMockDependencies() {
    return {
        extractUserId: (cognitoUserId) => {
            return "B2B-user-called-creator";
        },
        internalCreateApiKey: () => {
            return "offlineContext_apiKey";
        },
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' }))
    }
}

function makeRealDependencies() {
    return {
        extractUserId: (cognitoUserId) => {
            const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
            const splitted = cognitoAuthenticationProvider.split(":");
            const userId = splitted[2];
            return userId;
        },
        internalCreateApiKey: makeInternalCreateApiKey(secrets, config),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion }))
    }
}
