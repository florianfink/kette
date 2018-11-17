const fetch = require("node-fetch");
const expect = require('chai').expect;
const secrets = require("../secrets");
const url = "http://localhost:3000";

describe('register and lookUp bike', function () {
    this.timeout(4000);

    it('by vendor, serialnumber and framenumber returns bicycle', async () => {

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

        const registerResponse = await fetch(url + "/register", init);
        expect(registerResponse.status).to.equal(200, "request not succesful");

        const registerResult = await registerResponse.json();

        //check -------------------------------------------------------------------------------------------------------
        expect(registerResult.error, "there was an error").to.be.undefined;

        //act -------------------------------------------------------------------------------------------------------
        const getBikeResponse = await fetch(url + "/bike?vendor="+vendor+"&serialNumber="+serialNumber+"&frameNumber="+ frameNumber);
        
        const getBikeResult = await getBikeResponse.json();
        
        expect(getBikeResult.frameNumber, JSON.stringify(getBikeResult)).to.be.equal(registrationData.frameNumber)
        expect(getBikeResult.ipfsImageHash).to.be.equal(registrationData.ipfsHash)

    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}