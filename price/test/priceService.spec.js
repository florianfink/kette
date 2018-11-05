const priceService = require("../priceService");
const { assert } = require('chai')

describe('integration test for price service', function () {
    process.env.IS_OFFLINE = "true";

    it('returns a valid price', async () => {

        const { priceInCents } = await priceService.getPrice();
        assert(priceInCents > 0 && priceInCents < 100, JSON.stringify(priceInCents))

    })
})