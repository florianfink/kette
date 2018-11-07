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

    it('returns bike by uniqueId', async () => {
        
        const uniqueAssetId = makeRandomString();
        const ipfsHash = "ipfsHash";
        const description = "description";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(uniqueAssetId, description, ipfsHash, ownerEthAddress);
        expect(txHash, JSON.stringify(txHash)).to.contain("0x");
        
        const bike = await smartContractService.getBike(uniqueAssetId);
        expect(bike.ipfsHash).to.be.equal(ipfsHash);
        expect(bike.description).to.be.equal(description);

    })

    it('returns undefined for unknown uniqueId ', async () => {
        
        const bike = await smartContractService.getBike(makeRandomString());
        expect(bike).to.be.undefined;

    })
    
    it('returns bikes by ethAddress of owner', async () => {
        
        const uniqueId = makeRandomString();
        const ipfsImageHash = "ipfsHash";
        const description = "description";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(uniqueId, description, ipfsImageHash, ownerEthAddress);
        expect(txHash, JSON.stringify(txHash)).to.contain("0x");

        const secondUniqueId = makeRandomString();
        const secondDescription = "second " + makeRandomString();
        const secondHash = await smartContractService.register(secondUniqueId, secondDescription, ipfsImageHash, ownerEthAddress);
        expect(secondHash, JSON.stringify(secondHash)).to.contain("0x");

        const bikes = await smartContractService.getBikes(ownerEthAddress);

        const bike1 = bikes.find(x => x.uniqueId === uniqueId);
        expect(bike1.description).to.be.equal(description);

        const bike2 = bikes.find(x => x.uniqueId === secondUniqueId);
        expect(bike2.description).to.be.equal(secondDescription);
        
    }).timeout(30000)

})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}