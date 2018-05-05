/*
*    B2B endpoint for creators to create their api key
*/

"use strict";

const makeCreateApiKey = require("./apiKeys/src/apiKeyManagement").makeCreateApiKey;
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const secrets = require("./secrets");
const config = require("./config");
const AWS = require('aws-sdk');

module.exports.createApiKey = async (event, context, callback) => {
    
    let userId;
    if (process.env.IS_OFFLINE === 'true') {
        userId = "B2B-user-called-creator";
    }
    else {
        const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
        const splitted = cognitoAuthenticationProvider.split(":");
        userId = splitted[2];
    }

    let newApiKey;
    if (process.env.IS_OFFLINE === 'true') {
        newApiKey = "offlineContext_apiKey";
    }
    else {
        const createApiKey = makeCreateApiKey(secrets, config);
        newApiKey = await createApiKey();
    }

    const apiKeyRepository = makeApiKeyRepository(createDynamoDb());

    const newApiKeyUserIdMapping = {
        apiKey : newApiKey,
        userId : userId
    }

    const apiKeyUserMappingSaveResult = await apiKeyRepository.save(newApiKeyUserIdMapping);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify({apiKey : newApiKey})
    }

    callback(null, response);
}

function createDynamoDb() {
    let dynamoDb;
    if (process.env.IS_OFFLINE === 'true') {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })
    }
    else {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: config.awsRegion });
    }
    return dynamoDb;
}