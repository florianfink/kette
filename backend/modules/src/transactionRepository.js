"use strict";
const assert = require("assert");

module.exports = function (dynamoDb) {
    assert(dynamoDb, "dynamo db not set");

    return {
        save: async (transaction) => {
            
            var params = {
                TableName: process.env.ASSETTRANSACTIONS_TABLE,
                Item: transaction
            };
            await dynamoDb.put(params).promise();
        },
        get: async (id) => {
            var params = {
                TableName: process.env.ASSETTRANSACTIONS_TABLE,
                Key: {
                    'id': id
                },
            };
            const result = await dynamoDb.get(params).promise();
            return result.Item;
        },
        findByUniqueAssetId: async (uniqueAssetId) => {
            var params = {
                TableName: process.env.ASSETTRANSACTIONS_TABLE,
                IndexName: process.env.ASSETTRANSACTIONS_TABLE_UNIQUEASSETID_INDEX,
                KeyConditionExpression: "uniqueAssetId=:uniqueAssetId",
                ExpressionAttributeValues: { ":uniqueAssetId": uniqueAssetId }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        },
        findByEthAddress: async (ethAddress) => {
            var params = {
                TableName: process.env.ASSETTRANSACTIONS_TABLE,
                IndexName: process.env.ASSETTRANSACTIONS_TABLE_ETHADDRESS_INDEX,
                KeyConditionExpression: "ethAddress=:ethAddress",
                ExpressionAttributeValues: { ":ethAddress": ethAddress }
            };

            const result = await dynamoDb.query(params).promise();
            return result.Items;
        }
    }
}