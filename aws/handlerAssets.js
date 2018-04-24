/*
*    B2C endpoint for users to their registered assets
*/

"use strict";
const AWS = require('aws-sdk');
const assert = require("assert");
const makePublicRepository = require("./register/src/publicRepository");
const makePrivateRepository = require("./register/src/privateRepository");

module.exports.getAssets = async (event, context, callback) => {

    const privateRepository = makePrivateRepository();
    
    const username = "myUserIdHere";
    
    const publicRepository = makePublicRepository();
    
    const users = await privateRepository.find(username);
    const user = users[0];
    const assets = user.assets;

    const promises = assets.map(async asset => {
        const assetId = asset.uniqueAssetId;
        const publicRecord = await publicRepository.find(assetId);
        return publicRecord;
    })

    console.log(promises);
    const result = await Promise.all(promises);
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(result)
    }

    callback(null, response);
}