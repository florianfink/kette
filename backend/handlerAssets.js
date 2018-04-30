/*
*    B2C endpoint for users to get their registered assets
*/

"use strict";

const assert = require("assert");
const makePublicRepository = require("./modules/src/publicRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const config = require("./config");
const convertTransactions = require("./assets/src/transactionConverter").convert;
const AWS = require('aws-sdk');

module.exports.getAssets = async (event, context, callback) => {
    let userId;

    if (process.env.IS_OFFLINE === 'true') {
        userId = "user 0.07714873582932413";
    }
    else {
        const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
        const splitted = cognitoAuthenticationProvider.split(":");
        userId = splitted[2];
    }

    const privateRepository = makePrivateRepository(createDynamoDb());
    const publicRepository = makePublicRepository(createDynamoDb());

    const userRecord = await privateRepository.get(userId);
    const assetTransactions = await publicRepository.findByEthAddress(userRecord.ethAddress);

    const assets = convertTransactions(assetTransactions);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify(assets)
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