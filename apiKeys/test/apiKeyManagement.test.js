const expect = require('chai').expect;

var { makeInternalCreateApiKey } = require('../apiKeyManagement');

describe("apiKeyManagement", () => {

    it('[internalCreateApiKey] -> create an apikey and call createUsagePlanKey', async () => {
        const expectedApiKey = "lol cool apiKey";
        const expectedApiKeyId = "lol cool Id";
        const expectedUsagePlanKeyId = "usagePlanCreationResultValue";


        const expectedApiKeyCreationParams = {
            enabled: true
        }

        const expectedUsagePlanParams = {
            keyId: expectedApiKeyId,
            keyType: 'API_KEY',
            usagePlanId: process.env.USAGEPLAN_ID
        };

        let createUsagePlanCalled = false;
        let createApiKeyCalled = false;

        const apiGatewayMock = {
            createApiKey: (params) => {
                createApiKeyCalled = true;
                expect(params).to.be.deep.equal(expectedApiKeyCreationParams);
                return { promise: () => { return { value: expectedApiKey, id: expectedApiKeyId } } }
            },
            createUsagePlanKey: (params) => {
                expect(params).to.be.deep.equal(expectedUsagePlanParams);
                createUsagePlanCalled = true;
                return { promise: () => { return { id: expectedUsagePlanKeyId } } }
            }
        };

        const internalCreateApiKey = makeInternalCreateApiKey(apiGatewayMock);

        const apiKeyCreationResult = await internalCreateApiKey();

        expect(apiKeyCreationResult.apiKey).to.be.equal(expectedApiKey);
        expect(apiKeyCreationResult.apiKeyId).to.be.equal(expectedApiKeyId);
        expect(apiKeyCreationResult.usagePlanKeyId).to.be.equal(expectedUsagePlanKeyId);
        expect(createUsagePlanCalled).to.be.true;
        expect(createApiKeyCalled).to.be.true;
    })
})