/*
*    B2B endpoint to get all B2C-users that were created by them
*/

"use strict";

const AWS = require('aws-sdk');
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makeUserRecordRepository = require("./modules/src/privateRepository");

const makeGetUsers = require("./users/src/usersGetter").makeGetUsers;

const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

module.exports.getUsers = async (event) => {

    const apiKey = event.requestContext.identity.apiKey;

    const dependencies = makeDependencies();
    const getUsers = makeGetUsers(dependencies);

    const result = await getUsers(apiKey);

    const response = createAwsResponse(result);
    return response;
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
        userRecordRepository: makeUserRecordRepository(new AWS.DynamoDB.DocumentClient()),
    }
}

function makeMockDependencies() {

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        userRecordRepository: makeUserRecordRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    }
}
