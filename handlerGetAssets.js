/*
*    B2C endpoint for B2C-Users to get their registered assets
*/

"use strict";

const assert = require("assert");

const makeTransactionRepository = require("./modules/src/transactionRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const extractUserId = require("./modules/src/awsHelper").extractUserId;
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const makeGetAssets = require("./assets/src/assetGetter").makeGetAssets;

const AWS = require('aws-sdk');

module.exports.getAssets = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;

    const dependencies = makeDependencies();
    const getAssets = makeGetAssets(dependencies);
    
    const userId = dependencies.extractUserId(cognitoAuthenticationProvider);
    const result = await getAssets(userId);

    const response = createAwsResponse(result);
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
        transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient()),
        privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient()),
        extractUserId: extractUserId
    }
}

function makeMockDependencies() {

    return {
        transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        extractUserId: () => { return "B2C user called user Id: 0.9943440578095173" }
    }
}