const fetch = require("node-fetch");
const expect = require('chai').expect;

const url = "http://localhost:3000";

describe('serverless offline register test', function () {
    this.timeout(4000);

    it('get Bike', async () => {

        //prepare -------------------------------------------------------------------------------------------------------
        const uniqueId = makeRandomString();

        const registrationData = {
            uniqueId: uniqueId,
            description: "myCoolBike",
            ipfsHash: "willBreakLater",
            bikeOwnerAccount: "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38",
            stripeToken: "tok_visa"
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
        const getBikeResponse = await fetch(url + "/bike?uniqueId="+uniqueId);
        
        const getBikeResult = await getBikeResponse.json();
        
        expect(getBikeResult.description, JSON.stringify(getBikeResult)).to.be.equal(registrationData.description)
        expect(getBikeResult.ipfsHash).to.be.equal(registrationData.ipfsHash)

    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}