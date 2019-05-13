const smartContractService = require("../modules/smartContractService");
const expect = require('chai').expect;

describe('integration test for smart contract service', function () {
    process.env.IS_OFFLINE = "true";

    it('returns valid transaction', async () => {

        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();

        const ipfsImageHash = "ipfsHash";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress);

        expect(txHash, JSON.stringify(txHash)).to.contain("0x");
    })

    it('returns bike by vendor, serialNumber and frameNumber', async () => {

        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();
        const ipfsImageHash = "ipfsHash";

        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress);
        expect(txHash, JSON.stringify(txHash)).to.contain("0x");

        const bike = await smartContractService.lookUpBicycle(vendor, serialNumber, frameNumber);
        expect(bike.ipfsImageHash).to.be.equal(ipfsImageHash);
        expect(bike.state).to.be.equal("ok");

    })

    it('returns undefined for unknown vendor, serialNumber and frameNumber combination', async () => {

        const bike = await smartContractService.lookUpBicycle(makeRandomString(), "bla", "blubb");
        expect(bike).to.be.undefined;

    })

    it('returns bikes by ethAddress of owner', async () => {

        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();
        const ipfsImageHash = "ipfsHash1";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const txHash = await smartContractService.register(vendor, serialNumber, frameNumber, ipfsImageHash, ownerEthAddress);
        expect(txHash, JSON.stringify(txHash)).to.contain("0x");

        const secondVendor = makeRandomString();
        const secondSerialNumber = makeRandomString();
        const secondFrameNumber = makeRandomString();
        const secondIpfsImageHash = "ipfsHash2";

        const secondHash = await smartContractService.register(secondVendor, secondSerialNumber, secondFrameNumber, secondIpfsImageHash, ownerEthAddress);
        expect(secondHash, JSON.stringify(secondHash)).to.contain("0x");

        const bikes = await smartContractService.getBikes(ownerEthAddress);
        
        const bike1 = bikes.find(x => x.vendor === vendor);
        expect(bike1.ipfsImageHash).to.be.equal(ipfsImageHash);

        const bike2 = bikes.find(x => x.vendor === secondVendor);
        expect(bike2.ipfsImageHash).to.be.equal(secondIpfsImageHash);

    }).timeout(30000)

})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}