const assert = require("assert");

"use strict";

exports.makeCreateBlockchainRecord = function (blockchainService, webHookUrl, ketteSecret) {
    assert(blockchainService, "blockchainService not set");
    assert(webHookUrl, "webHookUrl not set");
    assert(ketteSecret, "ketteSecret not set");

    const createBlockchainRecord = async function (record, transactionId) {
        assert(record, "record not set");
        assert(transactionId, "assetId not set");

        const hash = blockchainService.hash(JSON.stringify(record));
        const hook = webHookUrl + "/" + transactionId + "?ketteSecret=" + ketteSecret;
        const result = await blockchainService.stamp(hash, hook);
        
        return {
            id: result.id,
            date : new Date(result.time),
            status : "pending"
        };
    }

    return createBlockchainRecord;
}
