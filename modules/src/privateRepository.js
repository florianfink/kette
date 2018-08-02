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
        get: async (userId) => {
            var params = {
                TableName: process.env.USERS_TABLE,
                Key: {
                    'userId': userId
                },
            };
            const result = await dynamoDb.get(params).promise();
            return result.Item;
        },
        findByCreatorId: async (creatorId) => {
            var params = {
                TableName: process.env.USERS_TABLE,
                IndexName: process.env.USERS_TABLE_CREATORID_INDEX,
                KeyConditionExpression: "creatorId=:creatorId",
                ExpressionAttributeValues: { ":creatorId": creatorId }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        }
    }
}