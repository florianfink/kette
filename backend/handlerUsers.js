/*
*    B2B endpoint for registerd registrators to get all users that were created by them
*/

"use strict";

const AWS = require('aws-sdk');
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const config = require("./config");

module.exports.getUsers = async (event, context, callback) => {

    const apiKey = event.requestContext.identity.apiKey;
    const apiKeyRepository = makeApiKeyRepository(createDynamoDb());
    const apiKeyUserIdMapping = await apiKeyRepository.get(apiKey);

    const privateRepository = makePrivateRepository(createDynamoDb());
    const users = await privateRepository.findByCreatorId(apiKeyUserIdMapping.userId);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify(users)
    }

    callback(null, response);
}


function createDynamoDb() {
    let dynamoDb;
    if (process.env.IS_OFFLINE === 'true') {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })
    }
    else {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: config.awsRegion});
    }
    return dynamoDb;
}