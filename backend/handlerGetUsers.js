/*
*    B2B endpoint for registerd registrators to get all users that were created by them
*/

"use strict";

const AWS = require('aws-sdk');
const makeGetUser = require("./modules/src/userManagement").makeGetUser;
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const config = require("./config");
const secrets = require("./secrets");

module.exports.getUsers = async (event, context, callback) => {

    const apiKey = event.requestContext.identity.apiKey;
    const deps = makeDependencies();

    const apiKeyUserIdMapping = await deps.apiKeyRepository.get(apiKey);
    const users = await deps.privateRepository.findByCreatorId(apiKeyUserIdMapping.userId);
    
    const cognitoUserPromises = users.map(async (user) => {
        return await deps.getUser(user.userId);
    });

    const cognitoUsers = await Promise.all(cognitoUserPromises);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify(cognitoUsers)
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

function makeRealDependencies() {
    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })),
        privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })),
        getUser: makeGetUser(new AWS.CognitoIdentityServiceProvider({ region: config.awsRegion, accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey }))
    }
}

function makeMockDependencies() {

    const mockCognitoyIdentityServiceProvider = {
        adminGetUser: (params) => {
            return {
                promise: async () => {
                    return { name: "Hans Wurst", id: params.Username };
                }
            }
        }
    }

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        getUser: makeGetUser(mockCognitoyIdentityServiceProvider, "lol does not matter")
    }
}
