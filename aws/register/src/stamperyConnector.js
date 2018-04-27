const assert = require("assert");
const Stampery = require('stampery');

"use strict";

exports.makeCreateBlockchainRecord = function (secrets, config) {
    assert(secrets.stamperySecret, "stamperySecret not set");
    assert(secrets.ketteSecret, "secrets.ketteSecret not set");

    const createBlockchainRecord = async function (record, assetId) {
        assert(record, "record not set");
        assert(assetId, "assetId not set");

        const stampery = new Stampery(secrets.stamperySecret);

        const hash = stampery.hash(JSON.stringify(record));
        const hook = config.webHookUrl + "/" + assetId + "?ketteSecret=" + secrets.ketteSecret;
        const result = await stampery.stamp(hash, hook);
        
        return {
            id: result.id,
            timestamp : result.time,
            status : "pending"
        };
    }

    return createBlockchainRecord;
}
