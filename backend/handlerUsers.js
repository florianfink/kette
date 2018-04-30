/*
*    B2B endpoint for registerd registrators to get all users that were created by them
*/

"use strict";

const AWS = require('aws-sdk');
const assert = require("assert");
const makePrivateRepository = require("./modules/src/privateRepository");
const config = require("./config");

module.exports.getUsers = async (event, context, callback) => {

    const creatorId = event.requestContext.identity.apiKey;

    const privateRepository = makePrivateRepository(createDynamoDb());
    const users = await privateRepository.findByCreatorId(creatorId);

    const response = {
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