"use strict";

const AWS = require('aws-sdk');
const assert = require("assert");

const ASSETS_TABLE = process.env.ASSETS_TABLE;
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
        save: async (entry) => {
            console.log(entry);
            var params = {
                TableName: ASSETS_TABLE,
                Item: entry
            };
            await dynamoDb.put(params).promise();
        },
        find: async (uniqueAssetIdentifier) => {
            var params = {
                TableName: ASSETS_TABLE,
                KeyConditionExpression: 'uniqueAssetId = :uniqueAssetId',
                ExpressionAttributeValues: {
                    ':uniqueAssetId': uniqueAssetIdentifier
                },
            };
            const result = await dynamoDb.query(params).promise();
            return result.Items;
        }
    }
}