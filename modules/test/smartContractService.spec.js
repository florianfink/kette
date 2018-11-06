const smartContractService = require("../src/smartContractService");
const expect = require('chai').expect;

describe('integration test for smart contract service', function () {
    process.env.IS_OFFLINE = "true";

    it('returns valid transaction', async () => {
        
        const uniqueAssetId = makeRandomString();
        const ipfsImageHash = "ipfsHash";
        const description = "description";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);

        expect(txHash, JSON.stringify(txHash)).to.contain("0x");
    })

    it('returns bicycle by uniqueId', async () => {
        
        const uniqueAssetId = makeRandomString();
        const ipfsImageHash = "ipfsHash";
        const description = "description";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(uniqueAssetId, description, ipfsImageHash, ownerEthAddress);
        expect(txHash, JSON.stringify(txHash)).to.contain("0x");
        
        const bicycle = await smartContractService.getBike(uniqueAssetId);
        expect(bicycle.ipfsImageHash).to.be.equal(ipfsImageHash);
        expect(bicycle.description).to.be.equal(description);

    })

    it('returns undefined for unknown uniqueId ', async () => {
        
        const bicycle = await smartContractService.getBike(makeRandomString());
        expect(bicycle).to.be.undefined;

    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}