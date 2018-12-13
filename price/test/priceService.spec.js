const priceService = require("../priceService");
const { assert } = require('chai')

describe('integration test for price service', function () {
    process.env.IS_OFFLINE = "true";

    it('returns a valid price', async () => {

        const { priceInCents } = await priceService.getPrice();
        assert(priceInCents >= 50 && priceInCents < 200, JSON.stringify(priceInCents))

    })
})