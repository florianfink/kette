const { makeGetBikes } = require("../../bikes/get/authBikeSerivce");
const expect = require('chai').expect;

describe('authBikeSerivce', function () {
    process.env.IS_OFFLINE = "true";
    this.timeout(3500);

    it('returns error if creatorId does not match userId of apiKey', async () => {

        const expectedCreatorId = "Alice";
        const testDependencies = {
            apiKeyRepository: { get: (apiKey) => { return { userId: expectedCreatorId } } },
            userRepository: { get: (userId, creatorId) => 
                { 
                    expect(creatorId).to.be.equal(expectedCreatorId);
                    return undefined 
                } },
        };

        const getBikes = makeGetBikes(testDependencies)

        const result = await getBikes("random", "any");
        expect(result.hasError).to.be.true;
        expect(result.message).to.contain("not found or allowed to read user");
    })
})