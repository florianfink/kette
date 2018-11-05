const makeRegister = require("../registryForUser").makeRegister;
const expect = require('chai').expect;

describe('integration test for registryForUser', function () {
    process.env.IS_OFFLINE = "true";
    this.timeout(3500);

    it('returns valid transaction', async () => {

        const register = makeRegister(
            {
                get: (apiKey) => { return { userId: "bloeb" } }
            },
            (userId) => { return { ethAddress: "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38" } }
        )

        const uniqueAssetId = makeRandomString();
        const ipfsImageHash = "ipfsHash";
        const description = "description";
        const userId = "PeterLustig";
        const apiKey = "tok_visa";

        const txHash = await register(uniqueAssetId, description, ipfsImageHash, apiKey, userId);

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