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
        },
        find: async (userId) => {
            var params = {
                TableName: USERS_TABLE,
                KeyConditionExpression: 'userId = :userId',
                ExpressionAttributeValues: {
                    ':userId': userId
                },
            };
            const result = await dynamoDb.query(params).promise();
            return result.Items;
        },
        findByCreatorId: async (creatorId) => {
            var params = {
                TableName: USERS_TABLE, // maps back to the serverless config variable above
                IndexName: process.env.USERS_TABLE_CREATORID_INDEX, // maps back to the serverless config variable above
                KeyConditionExpression: "creatorId=:creatorId",
                ExpressionAttributeValues: { ":creatorId": creatorId }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        }
    }
}