/*
*    Webhook endpoint to update blockchain records when confirmation arrives
*/

"use strict";

const assert = require("assert");
const makeTransactionRepository = require("./modules/src/transactionRepository");
const secrets = require("./secrets");
const config = require("./config");
const AWS = require('aws-sdk');

module.exports.updateAsset = async (event, context, callback) => {

    const secretInRequest = event.queryStringParameters.ketteSecret;

    if (secretInRequest !== secrets.ketteSecret) {
        const response = {
            statusCode: 403,
            body : JSON.stringify({message: "Authorization required"})
        }
        callback(null, response);
        return
    }

    const transactionRepository = makeTransactionRepository(createDynamoDb());
    const id = event.pathParameters.id;
    const transaction = await transactionRepository.get(id);
    
    if(!transaction){
        const response = {
            statusCode: 400,
            body : JSON.stringify({message: "Transaction not found. Id: " + id})
        }
        callback(null, response);
        return
    }

    const blockchainReceipt = JSON.parse(event.body);
    
    if(transaction.blockchainRecordId !== blockchainReceipt.id) {
        const response = {
            statusCode: 400,
            body : JSON.stringify({message: "transaction blockchainRecordId: " + transaction.blockchainId  + " and blockchainreceipt id: " + blockchainReceipt.id + "not not match "})
        }
        callback(null, response);
        return
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(transaction)
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