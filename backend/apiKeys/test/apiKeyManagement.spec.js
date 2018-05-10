const expect = require('chai').expect;
const assert = require('chai').assert;

var makeInternalCreateApiKey = require('../src/apiKeyManagement').makeInternalCreateApiKey;

it('[internalCreateApiKey] -> create an apikey and call createUsagePlanKey', async () => {
    const expectedApiKey = "lol cool apiKey";
    const expectedApiKeyId = "lol cool Id";
    const expectedUsageKeyId = "usagePlanCreationResultValue";
    const expectedUsagePlanId = "cool usage plan Id";

    const expectedApiKeyCreationParams = {
        enabled: true
    }

    const expectedUsagePlanParams = {
        keyId: expectedApiKeyId,
        keyType: 'API_KEY',
        usagePlanId: expectedUsagePlanId
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
            return { promise: () => { return { value: expectedUsageKeyId } } }
        }
    };

    const internalCreateApiKey = makeInternalCreateApiKey(apiGatewayMock, expectedUsagePlanId);

    const apikey = await internalCreateApiKey();

    expect(apikey).to.be.equal(expectedApiKey);
    expect(createUsagePlanCalled).to.be.true;
    expect(createApiKeyCalled).to.be.true;
})