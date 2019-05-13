const register = require("../registryWithCreditCard").register;
const expect = require('chai').expect;

describe('integration test for registryWithCreditCard', function () {
    process.env.IS_OFFLINE = "true";
    this.timeout(3500);
    
    it('returns valid transaction', async () => {
        
        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();
        const ipfsImageHash = "ipfsHash";
        const ownerEthAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";
        const stripeToken = "tok_visa";

        const txHash = await register(vendor, serialNumber, frameNumber,ipfsImageHash, ownerEthAddress, stripeToken);

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