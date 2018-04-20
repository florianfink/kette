"use strict";
const AWS = require('aws-sdk');
const assert = require("assert");

const USERS_TABLE = process.env.USERS_TABLE;
const IS_OFFLINE = process.env.IS_OFFLINE

let dynamoDb;
if (IS_OFFLINE === 'true') {
    dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })
}
else {
    dynamoDb = new AWS.DynamoDB.DocumentClient();
}

module.exports = function () {

    return {
        save: async (user) => {
            const params = {
                TableName: USERS_TABLE,
                Item: user
            };
            await dynamoDb.put(params).promise();
        }
    }
}