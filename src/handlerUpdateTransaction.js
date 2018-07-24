/*
*    Webhook endpoint to update blockchain records when confirmation arrives
*/

"use strict";

const makeTransactionRepository = require("./modules/src/transactionRepository");
const makeUpdateTransaction = require("./transaction/src/transactionUpdater").makeUpdateTransaction;
const AWS = require('aws-sdk');
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const secrets = require("./secrets");

module.exports.updateTransaction = async (event, context, callback) => {

    const input = parseInputEvent(event);
    if(input.hasError) {
        const response = createAwsResponse(input);
        callback(null, response);
        return;
    }

    const transactionRepository = makeTransactionRepository(createDynamoDb());
    const updateTransaction = makeUpdateTransaction(transactionRepository, secrets);

    const result = await updateTransaction(input.secretInRequest, input.transactionId, input.blockchainReceipt);
    const response = createAwsResponse(result);
    callback(null, response);
}


function createDynamoDb() {
    let dynamoDb;
    if (process.env.IS_OFFLINE === 'true') {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })
    }
    else {
        dynamoDb = new AWS.DynamoDB.DocumentClient();
    }
    return dynamoDb;
}

function parseInputEvent(event) {

    try {
        const secretInRequest = event.queryStringParameters.ketteSecret;
        const blockchainReceipt = JSON.parse(event.body);
        const transactionId = event.pathParameters.id;

        if(!secretInRequest) return { hasError: true, message: "secret is missing" }
        if(!blockchainReceipt) return { hasError: true, message: "blockchain receipt missing or wrong" }
        if(!transactionId) return { hasError: true, message: "id is missing" }

        return {
            secretInRequest: secretInRequest,
            blockchainReceipt: blockchainReceipt,
            transactionId: transactionId
        }
    } catch (error) {
        return { hasError: true, message: error.message }
    }
}