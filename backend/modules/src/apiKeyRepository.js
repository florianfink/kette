"use strict";
const assert = require("assert");

module.exports = function (dynamoDb) {
    assert(dynamoDb, "dynamo db not set");

    return {
        save: async (entry) => {
            assert(entry.userId, "userId not set")
            assert(entry.apiKey, "apiKey not set")

            var params = {
                TableName: process.env.APIKEYS_TABLE,
                Item: entry
            };
            const saveResult = await dynamoDb.put(params).promise();
            return saveResult;
        },
        findByUserId: async (userId) => {
            var params = {
                TableName: process.env.APIKEYS_TABLE,
                IndexName: process.env.APIKEYS_TABLE_USERID_INDEX,
                KeyConditionExpression: "userId=:userId",
                ExpressionAttributeValues: { ":userId": userId }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        },
        get: async (apiKey) => {
            var params = {
                TableName: process.env.APIKEYS_TABLE,
                Key: {
                    "apiKey": apiKey
                },
            };
            const result = await dynamoDb.get(params).promise();
            return result.Item;
        }
    }
}