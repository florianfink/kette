const fetch = require("node-fetch");
const expect = require('chai').expect;
const secrets = require("./config/test-secrets");

const url = "http://localhost:3000";

describe('serverless offline register test', function () {

    it('register user with new asset', async () => {

        //prepare -------------------------------------------------------------------------------------------------------
        const uniqueAssetId = makeRandomString();
        const assetType = "bicycle";

        const registrationData = {
            uniqueAssetId: uniqueAssetId,
            assetType: assetType
        }

        const init = {
            body: JSON.stringify(registrationData),
            method: 'POST',
            headers: {
                'x-api-key': secrets.apiKey,
                'content-type': 'application/json'
            }
        };

        //act -------------------------------------------------------------------------------------------------------

        const registerResponse = await fetch(url + "/register", init)
        expect(registerResponse.status).to.equal(200, "request not succesful");

        const registerResult = await registerResponse.json();
        
        //check -------------------------------------------------------------------------------------------------------
        expect(registerResult.error, "there was an error").to.be.undefined;

        const getAssetsResponse = await fetch(url + "/assets", { method: 'GET', headers: { 'x-api-key': secrets.apiKey, 'content-type': 'application/json' } });
        const assets = await getAssetsResponse.json();
        const createdAsset = assets.find(x => x.uniqueAssetId === uniqueAssetId);

        expect(createdAsset).not.to.be.undefined;
        expect(createdAsset.assetType).to.equal(assetType);
    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}