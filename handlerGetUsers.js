/*
*    B2B endpoint to get all B2C-users that were created by them
*/

"use strict";

const AWS = require('aws-sdk');
const makeGetUser = require("./modules/src/userManagement").makeGetUser;
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makePrivateRepository = require("./modules/src/privateRepository");

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
        privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient()),
        getUser: makeGetUser(new AWS.CognitoIdentityServiceProvider())
    }
}

function makeMockDependencies() {

    const mockCognitoyIdentityServiceProvider = {
        adminGetUser: (params) => {
            return {
                promise: async () => { return { name: "Hans Wurst", id: params.Username }; }
            }
        }
    }

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        getUser: makeGetUser(mockCognitoyIdentityServiceProvider, "lol does not matter")
    }
}
