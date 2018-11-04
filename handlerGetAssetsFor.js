/*
* B2B endpoint to get all registered assets of an user.
*/

"use strict";

const makeTransactionRepository = require("./modules/src/transactionRepository");
const makeuserRepository = require("./modules/src/userRepository");
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const makeGetAssets = require("./assets/src/assetGetter").makeGetAssets;

const AWS = require('aws-sdk');

module.exports.getAssets = async (event) => {

    const userId = event.pathParameters.id;

    const dependencies = makeDependencies();
    const getAssets = makeGetAssets(dependencies);

    const result = await getAssets(userId);

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
        transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient()),
        userRepository: makeuserRepository(new AWS.DynamoDB.DocumentClient()),
    }
}

function makeMockDependencies() {

    return {
        transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        userRepository: makeuserRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    }
}