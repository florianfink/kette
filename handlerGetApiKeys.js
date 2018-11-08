/*
*    B2B endpoint for B2B-Users to get their api key
*/

"use strict";

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const { createAwsResponse, extractUserId } = require("./modules/src/awsHelper");
const makeGetApiKeys = require("./apiKeys/src/apiKeysGetter").makeGetApiKeys;

const AWS = require('aws-sdk');

module.exports.getApiKeys = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;

    const dependencies = makeDependencies();
    const getApiKeys = makeGetApiKeys(dependencies);

    const result = await getApiKeys(cognitoAuthenticationProvider);

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

function makeRealDependencies() {
    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient()),
        extractUserId: extractUserId
    }
}

function makeMockDependencies() {

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        extractUserId: extractUserId
    }
}
