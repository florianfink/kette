const fetch = require("node-fetch");
const expect = require('chai').expect;
const secrets = require("./config/test-secrets");

const url = "http://localhost:3000";

describe('serverless offline registerFor test', function () {

    it('registerFor user with new asset', async () => {

        //pre-prepare -------------------------------------------------------------------------------------------------------
        
        //in real life, the signed-in user calls this endpoint AWS amplify
        //Serverless Offline does not support the AWS_IAM authorization type
        const apiKeyResponse = await fetch(url + "/apiKeys", { method: 'POST', headers: { 'content-type': 'application/json' } })
        const keyResult = await apiKeyResponse.json();
        const apiKey = keyResult.apiKey.apiKey;

        //prepare -------------------------------------------------------------------------------------------------------
        
        const uniqueAssetId = makeRandomString();
        const userId = makeRandomString();
        const assetType = "bicycle";
        
        const registrationData = {
            uniqueAssetId: uniqueAssetId,
            assetType: assetType,
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

        const getUsersResponse = await fetch(url + "/users", { method: 'GET', headers: { 'x-api-key': apiKey, 'content-type': 'application/json' } });
        const users = await getUsersResponse.json();
        const createdUser = users.find(x => x === userId);

        expect(createdUser).not.to.be.undefined;

        const getAssetsResponse = await fetch(url + "/assetsFor/" + userId, { method: 'GET', headers: { 'x-api-key': apiKey, 'content-type': 'application/json' } });
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