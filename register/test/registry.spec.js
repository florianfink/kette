const register = require("../registry").register;
const expect = require('chai').expect;

describe('integration test for registry', function () {
    process.env.IS_OFFLINE = "true";

    it('returns valid transaction', async () => {
        
        uniqueAssetId = makeRandomString();
        ipfsImageHash = "ipfsHash";
        description = "description";
        ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await register(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);

        expect(txHash, JSON.stringify(txHash)).to.contain("0x");
    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}