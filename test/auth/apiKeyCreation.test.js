const expect = require('chai').expect;

var { makeCreateApiKey } = require('../../apiKeys/apiKeyCreation');

describe("apiKeyCreation", () => {
    it('create an apikey and create an apiKey user mapping', async () => {

        const expectedApiKey = "expecetd Api Key";
        const expectedApiKeyId = "expecetd Api Key";
        const expectedUsagePlanKeyId = "expectedUsagePlanKeyId";
        const expectedUserId = "expected User Id";

        const expectedApiKeyUserIdMapping = {
            apiKey: expectedApiKey,
            userId: expectedUserId,
            apiKeyId: expectedApiKeyId,
            usagePlanKeyId: expectedUsagePlanKeyId
        };

        let saveCalled = false;
        const deps = {
            internalCreateApiKey: () => {
                return {
                    apiKey: expectedApiKey,
                    apiKeyId: expectedApiKeyId,
                    usagePlanKeyId: expectedUsagePlanKeyId
                };
            },
            apiKeyRepository: {
                save: (mappingToSave) => {
                    saveCalled = true;
                    expect(mappingToSave, "save called with unexpected parameters").to.deep.equal(expectedApiKeyUserIdMapping);
                }
            }
        }

        const createApiKey = makeCreateApiKey(deps);

        const apiKeyCreationResult = await createApiKey(expectedUserId);

        expect(apiKeyCreationResult.hasError, apiKeyCreationResult.message).to.be.undefined;
        expect(apiKeyCreationResult.apiKey.apiKey).to.be.equal(expectedApiKey);

        expect(saveCalled).to.be.true;
    })
})