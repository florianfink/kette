const fetch = require("node-fetch");
const expect = require('chai').expect;

const url = "http://localhost:3000";

describe('register and get bikes', function () {

    it('by ethAddress returns registerd bike', async () => {

        //prepare -------------------------------------------------------------------------------------------------------
        const uniqueId = makeRandomString();

        const ethAddress = "0x5ae6A13cF333d7747DC2f8224E4ED700429fEe38";

        const registrationData = {
            uniqueId: uniqueId,
            description: "myCoolBike",
            ipfsHash: "willBreakLater",
            bikeOwnerAccount: ethAddress,
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
        const getBikesResponse = await fetch(url + "/bikes/" + ethAddress);
        const bikes = await getBikesResponse.json();
        
        const registerdBike = bikes.find(x => x.uniqueId === uniqueId);

        expect(registerdBike).not.to.be.undefined;
        expect(registerdBike.ipfsHash).to.equal(registrationData.ipfsHash);

    }).timeout(7500)
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}