const fetch = require("node-fetch");
const expect = require('chai').expect;
const secrets = require("../secrets");

const url = "http://localhost:3000";

describe('create bike', function () {
    this.timeout(5000);

    it('returns valid transaction hash', async () => {

        //prepare -------------------------------------------------------------------------------------------------------
        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();

        const registrationData = {
            vendor: vendor,
            serialNumber: serialNumber,
            frameNumber : frameNumber,
            ipfsHash: "willBreakLater",
            bikeOwnerAccount: "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38",
            stripeToken: "tok_visa",
            ketteSecret : secrets.ketteSecret
        }

        const init = {
            body: JSON.stringify(registrationData),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        };

        //act -------------------------------------------------------------------------------------------------------

        const createBikeResponse = await fetch(url + "/bikes", init);
        expect(createBikeResponse.status).to.equal(200, "request not succesful");

        const txHash = await createBikeResponse.json();

        //check -------------------------------------------------------------------------------------------------------
        expect(txHash.error, "there was an error").to.be.undefined;
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