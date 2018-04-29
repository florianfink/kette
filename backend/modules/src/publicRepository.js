"use strict";

const AWS = require('aws-sdk');
const assert = require("assert");

const ASSETTRANSACTIONS_TABLE = process.env.ASSETTRANSACTIONS_TABLE;
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
            
            var params = {
                TableName: ASSETTRANSACTIONS_TABLE,
                Item: entry
            };
            await dynamoDb.put(params).promise();
        },
        findByUniqueAssetId: async (uniqueAssetId) => {
            var params = {
                TableName: ASSETTRANSACTIONS_TABLE,
                IndexName: process.env.ASSETTRANSACTIONS_TABLE_UNIQUEASSETID_INDEX,
                KeyConditionExpression: "uniqueAssetId=:uniqueAssetId",
                ExpressionAttributeValues: { ":uniqueAssetId": uniqueAssetId }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        },
        findByEthAddress: async (ethAddress) => {
            var params = {
                TableName: ASSETTRANSACTIONS_TABLE,
                IndexName: process.env.ASSETTRANSACTIONS_TABLE_ETHADDRESS_INDEX,
                KeyConditionExpression: "ethAddress=:ethAddress",
                ExpressionAttributeValues: { ":ethAddress": ethAddress }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        }
    }
}