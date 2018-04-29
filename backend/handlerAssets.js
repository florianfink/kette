/*
*    B2C endpoint for users to get their registered assets
*/

"use strict";

const assert = require("assert");
const makePublicRepository = require("./modules/src/publicRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const convertTransactions = require("./assets/src/transactionConverter").convert;

module.exports.getAssets = async (event, context, callback) => {
    let userId;
    const IS_OFFLINE = process.env.IS_OFFLINE

    if (IS_OFFLINE) {
        userId = "361109f3-92aa-4b2d-9b6f-c7f36ce46632";
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

    const assets = convertTransactions(assetTransactions);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify(assets)
    }

    callback(null, response);
}