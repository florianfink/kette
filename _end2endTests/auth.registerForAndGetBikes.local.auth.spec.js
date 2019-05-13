const fetch = require("node-fetch");
const expect = require('chai').expect;

const url = "http://localhost:3000";

describe('registerFor and get bikes', function () {

    it('by unique Id returns registerd bikes', async () => {

        //pre-prepare -------------------------------------------------------------------------------------------------------

        //in real life, the signed-in user calls this endpoint AWS amplify
        //Serverless Offline does not support the AWS_IAM authorization type
        const apiKeyResponse = await fetch(url + "/auth/apiKeys", { method: 'POST', headers: { 'content-type': 'application/json' } })
        const keyResult = await apiKeyResponse.json();
        const apiKey = keyResult.apiKey.apiKey;

        //prepare -------------------------------------------------------------------------------------------------------
        const vendor = makeRandomString();
        const serialNumber = makeRandomString();
        const frameNumber = makeRandomString();
        const userId = makeRandomString();

        const registrationData = {
            vendor: vendor,
            serialNumber : serialNumber,
            frameNumber : frameNumber,
            ipfsHash: "willBreakLaterForSure",
            userId: userId
        }

        const init = {
            body: JSON.stringify(registrationData),
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'content-type': 'application/json'
            }
        };

        //act -------------------------------------------------------------------------------------------------------

        const registerResponse = await fetch(url + "/auth/bikes", init)
        expect(registerResponse.status).to.equal(200, "request not succesful");

        const registerResult = await registerResponse.json();

        //check -------------------------------------------------------------------------------------------------------
        expect(registerResult.error, "there was an error").to.be.undefined;

        const getBikesResponse = await fetch(url + "/auth/bikes/" + userId, { method: 'GET', headers: { 'x-api-key': apiKey, 'content-type': 'application/json' } });

        const bikes = await getBikesResponse.json();
        const registerdBike = bikes.find(x => x.vendor === vendor);

        expect(registerdBike).not.to.be.undefined;
        expect(registerdBike.ipfsImageHash).to.equal(registrationData.ipfsHash);
        
    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}