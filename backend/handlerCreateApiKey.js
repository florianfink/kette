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
const assert = require("assert");

module.exports.createApiKey = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;

    const createApiKey = makeCreateApiKey(makeDependencies());

    const result = await createApiKey(cognitoAuthenticationProvider);

    let statusCode;
    let body;
    if (result.hasError) {
        statusCode = 400;
        body = JSON.stringify({message : "oops something went wrong"});
        console.log("ERROR: "  + result.message);
    } else {
        statusCode = 200;
        body = JSON.stringify({ apiKey: result.apiKey });
    }

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: statusCode,
        body: body
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

function makeMockDependencies() {
    const apiGatewayMock = {
        createApiKey: (params) => {
            return { promise: () => { return { value: "offlineContext_apiKey", id: "lol" } } }
        },
        createUsagePlanKey: (params) => {
            return { promise: () => { return { value: "not used" } } }
        }
    };

    return {
        extractUserId: (cognitoUserId) => {
            return "B2B-user-called-creator";
        },
        internalCreateApiKey: makeInternalCreateApiKey(apiGatewayMock, secrets.awsUsagePlanId),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' }))
    }
}

function makeRealDependencies() {

    const apiGateWayOptions = {
        accessKeyId: secrets.awsAccessKeyId,
        secretAccessKey: secrets.awsSecretAccessKey,
        region: config.awsRegion
    };

    return {
        extractUserId: (cognitoAuthenticationProvider) => {
            const splitted = cognitoAuthenticationProvider.split(":");
            const userId = splitted[2];
            assert(userId, "userId could not be extracted from: " + cognitoAuthenticationProvider);
            return userId;
        },
        internalCreateApiKey: makeInternalCreateApiKey(new AWS.APIGateway(apiGateWayOptions), secrets.awsUsagePlanId),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion }))
    }
}
