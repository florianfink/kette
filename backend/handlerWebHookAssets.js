/*
*    Webhook endpoint to update blockchain records when confirmation arrives
*/

"use strict";

const assert = require("assert");
const makePublicRepository = require("./modules/src/publicRepository");

module.exports.updateAsset = async (event, context, callback) => {

    const assetUniqueId = "myAssetId";

    const publicRepository = makePublicRepository();

    const asset = await publicRepository.find(assetUniqueId)

    const response = {
        statusCode: 200,
        body: "ok"
    }
    
    callback(null, response);
}