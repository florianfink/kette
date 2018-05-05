/*
*    B2B endpoint for creators to create their api key
*/

"use strict";

const makeCreateApiKey = require("./apiKeys/src/apiKeyManagement").makeCreateApiKey;
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const secrets = require("./secrets");
const config = require("./config");
const AWS = require('aws-sdk');
const createUniqueId = require("uuid").v1;

module.exports.createApiKey = async (event, context, callback) => {
    let userId;

    if (process.env.IS_OFFLINE === 'true') {
        userId = "user 0.07714873582932413";
    }
    else {
        const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
        const splitted = cognitoAuthenticationProvider.split(":");
        userId = splitted[2];
    }

    const createApiKey = makeCreateApiKey(secrets, config);
    const newApiKey = await createApiKey();

    const apiKeyRepository = makeApiKeyRepository(createDynamoDb());

    const newApiKeyUserIdMapping = {
        id : createUniqueId(),
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
        body: JSON.stringify({newApiKey : newApiKey, saveResult : apiKeyUserMappingSaveResult})
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