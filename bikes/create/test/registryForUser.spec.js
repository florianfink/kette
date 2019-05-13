const makeRegister = require("../registryForUser").makeRegister;
const expect = require('chai').expect;

describe('integration test for registryForUser', function () {
    process.env.IS_OFFLINE = "true";
    this.timeout(3500);

    it('returns valid transaction', async () => {

        const testDependencies = {
            apiKeyRepository: { get: (apiKey) => { return { userId: "bloeb" } } },
            getOrCreateUserRecord: (userId) => { return { ethAddress: "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38" } }
        };
        
        const register = makeRegister(testDependencies);

        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();
        
        const ipfsImageHash = "ipfsHash";
        const userId = "PeterLustig";
        const apiKey = "myApiKey123";

        const txHash = await register(vendor, serialNumber, frameNumber, ipfsImageHash, apiKey, userId);

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