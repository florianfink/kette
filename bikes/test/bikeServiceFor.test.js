const { makeGetBikesFor } = require("../bikeServiceFor");
const expect = require('chai').expect;

describe('bikeServiceFor', function () {
    process.env.IS_OFFLINE = "true";
    this.timeout(3500);

    it('returns error if creatorId does not match userId of apiKey', async () => {

        const testDependencies = {
            apiKeyRepository: { get: (apiKey) => { return { userId: "Alice" } } },
            userRepository: { get: (userId) => { return { userId: userId, creatorId: "Bob" } } },
    };

        const getBikesFor = makeGetBikesFor(testDependencies)

        const result = await getBikesFor("random", "any");
        expect(result.hasError).to.be.true;
        expect(result.message).to.contain("not allowed to read user");
    })
})