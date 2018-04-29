/*
*    B2C endpoint for users to get their registered assets
*/

"use strict";

const assert = require("assert");
const makePublicRepository = require("./modules/src/publicRepository");
const makePrivateRepository = require("./modules/src/privateRepository");

module.exports.getAssets = async (event, context, callback) => {
    let userId;
    const IS_OFFLINE = process.env.IS_OFFLINE

    if (IS_OFFLINE) {
        userId = "a80a8096-0a74-41d5-9739-4c2c35460a37";
    }
    else {
        const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
        const splitted = cognitoAuthenticationProvider.split(":");
        userId = splitted[2];
    }

    const privateRepository = makePrivateRepository();
    const publicRepository = makePublicRepository();

    const userRecord = await privateRepository.get(userId);
    const assetTransactions = await publicRepository.findByEthAddress(userRecord.ethAddress);

    const result = [
        {
            uniqueAssetId: "First Asset Id",
            assetType: "bicycle",
            assetTransactions: [{
                action: "register",
                date: new Date(),
                blockchainRecordId: "blockchain Record 1",
                id: "id 1",
                status: "pending"
            }]
        },
        {
            uniqueAssetId: "Second Asset Id",
            assetType: "bicycle",
            assetTransactions: [{
                action: "register",
                date: new Date(),
                blockchainRecordId: "blockchain Record 2",
                id: "id 2",
                status: "pending"
            }]
        }]

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify(result)


    }

    callback(null, response);
}