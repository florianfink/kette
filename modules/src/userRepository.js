"use strict";
const assert = require("assert");

module.exports = function (dynamoDb) {
    assert(dynamoDb, "dynamo db not set")

    return {
        save: async (user) => {
            const params = {
                TableName: process.env.USERS_TABLE,
                Item: user
            };
            await dynamoDb.put(params).promise();
        },
        get: async (userId, creatorId) => {
            var params = {
                TableName: process.env.USERS_TABLE,
                Key: {
                    userId : userId,
                    creatorId : creatorId
                },
            };
            const result = await dynamoDb.get(params).promise();
            return result.Item;
        }
    }
}