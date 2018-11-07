/*
* B2B endpoint to get all registered assets of an user.
*/

"use strict";

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makeuserRepository = require("./modules/src/userRepository");
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const makeGetBikes = require("./bikes/bikeGetter").makeGetBikes;

const AWS = require('aws-sdk');

module.exports.getAssets = async (event) => {

    const userId = event.pathParameters.id;

    const dependencies = makeDependencies();
    const getBikes = makeGetBikes(dependencies);

    const userRecord = await dependencies.userRepository.get(userId);
    //TODO: check if user records was created by api key that is calling the service
    //get apiKeyMapping, get userId from mapping, check if creator.id === userId
    const result = await getBikes(userRecord.ethAddress);

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
        userRepository: makeuserRepository(new AWS.DynamoDB.DocumentClient()),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient()),
    }
}

function makeMockDependencies() {

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        userRepository: makeuserRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    }
}