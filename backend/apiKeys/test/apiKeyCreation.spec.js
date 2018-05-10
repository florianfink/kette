const expect = require('chai').expect;
const assert = require('chai').assert;

var makeCreateApiKey = require('../src/apiKeyCreation').makeCreateApiKey;

it('[createApiKey] -> create an apikey and create an apiKey user mapping', async () => {

    const expectedApiKey = "expecetd Api Key";
    const expectedUserId = "expected User Id";

    const expectedApiKeyUserIdMapping = {
        apiKey: expectedApiKey,
        userId: expectedUserId
    };

    let saveCalled = false;
    const deps = {
        extractUserId: (bla) => {
            return expectedUserId;
        },
        internalCreateApiKey: () => {
            return expectedApiKey;
        },
        apiKeyRepository: {
            save: (mappingToSave) => {
                saveCalled = true;
                expect(mappingToSave, "save called with unexpected parameters").to.deep.equal(expectedApiKeyUserIdMapping);
            }
        }
    }

    const createApiKey = makeCreateApiKey(deps);

    const apiKeyCreationResult = await createApiKey();

    expect(apiKeyCreationResult.hasError, apiKeyCreationResult.message).to.be.undefined;
    expect(apiKeyCreationResult.apiKey).to.be.equal(expectedApiKey);

    expect(saveCalled).to.be.true;
})