const fetch = require("node-fetch");
const expect = require('chai').expect;

const url = "http://localhost:3000";

describe('create API-Key and get API-Key', function () {
    this.timeout(40000)
    it('by unique Id returns registerd bikes', async () => {

        //pre-prepare -------------------------------------------------------------------------------------------------------

        //in real life, the signed-in user calls this endpoint AWS amplify
        //Serverless Offline does not support the AWS_IAM authorization type
        const apiKeyResponse = await fetch(url + "/apiKeys", { method: 'POST', headers: { 'content-type': 'application/json' } })
        const keyResult = await apiKeyResponse.json();
        const apiKeyFromCreate = keyResult.apiKey.apiKey;

        //act -------------------------------------------------------------------------------------------------------
        const getApiKeysResponse = await fetch(url + "/apiKeys", { method: 'GET', headers: { 'content-type': 'application/json' } });

        const apiKeys = await getApiKeysResponse.json();
        const apiKeyFromGetApiyKey = apiKeys.find(x => x.apiKey === apiKeyFromCreate);
        
        //check -------------------------------------------------------------------------------------------------------
        expect(apiKeyFromGetApiyKey).not.to.be.undefined;
    })
})