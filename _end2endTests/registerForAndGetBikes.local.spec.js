const fetch = require("node-fetch");
const expect = require('chai').expect;

const url = "http://localhost:3000";

describe('serverless offline registerFor test', function () {
    it('registerFor and get bikes', async () => {

        //pre-prepare -------------------------------------------------------------------------------------------------------

        //in real life, the signed-in user calls this endpoint AWS amplify
        //Serverless Offline does not support the AWS_IAM authorization type
        const apiKeyResponse = await fetch(url + "/apiKeys", { method: 'POST', headers: { 'content-type': 'application/json' } })
        const keyResult = await apiKeyResponse.json();
        const apiKey = keyResult.apiKey.apiKey;

        //prepare -------------------------------------------------------------------------------------------------------
        const uniqueId = makeRandomString();
        const userId = makeRandomString();

        const registrationData = {
            uniqueId: uniqueId,
            ipfsHash: "ipfsHash",
            description: "description",
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

        const registerResponse = await fetch(url + "/registerFor", init)
        expect(registerResponse.status).to.equal(200, "request not succesful");

        const registerResult = await registerResponse.json();

        //check -------------------------------------------------------------------------------------------------------
        expect(registerResult.error, "there was an error").to.be.undefined;

        const getBikesResponse = await fetch(url + "/bikesFor/" + userId, { method: 'GET', headers: { 'x-api-key': apiKey, 'content-type': 'application/json' } });

        const bikes = await getBikesResponse.json();
        const registerdBike = bikes.find(x => x.uniqueId === uniqueId);

        expect(registerdBike).not.to.be.undefined;
        expect(registerdBike.ipfsHash).to.equal(registrationData.ipfsHash);
        
    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}