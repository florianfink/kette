"use strict";
const assert = require("assert");

module.exports = function (dynamoDb) {
    assert(dynamoDb, "dynamo db not set");

    return {
        save: async (entry) => {
            console.log(entry);
            var params = {
                TableName: process.env.APIKEYS_TABLE,
                Item: entry
            };

            console.log(params);
            const saveResult = await dynamoDb.put(params).promise();
            console.log(saveResult);
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
        findByApiKey: async (apiKey) => {
            var params = {
                TableName: process.env.APIKEYS_TABLE,
                IndexName: process.env.APIKEYS_TABLE_APIKEY_INDEX,
                KeyConditionExpression: "apiKey=:apiKey",
                ExpressionAttributeValues: { ":apiKey": apiKey }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        }
    }
}