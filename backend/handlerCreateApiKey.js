/*
*    B2B endpoint for creators to create their api key
*/

"use strict";

const makeCreateApiKey = require("./apiKeys/src/apiKeyCreation").makeCreateApiKey;

const makeInternalCreateApiKey = require("./apiKeys/src/apiKeyManagement").makeInternalCreateApiKey;
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const extractUserId = require("./modules/src/awsHelper").extractUserId;
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const AWS = require('aws-sdk');

module.exports.createApiKey = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;

    const dependencies = makeDependencies();
    const createApiKey = makeCreateApiKey(dependencies);

    const result = await createApiKey(cognitoAuthenticationProvider);

    const response = createAwsResponse(result);
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
            return { promise: () => { return { id: "usagePlanKeyId for test" } } }
        }
    };

    return {
        extractUserId: (cognitoUserId) => {
            return "B2B-user-called-creator";
        },
        internalCreateApiKey: makeInternalCreateApiKey(apiGatewayMock),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' }))
    }
}

function makeRealDependencies() {

    return {
        extractUserId: extractUserId,
        internalCreateApiKey: makeInternalCreateApiKey(new AWS.APIGateway()),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient())
    }
    
}
