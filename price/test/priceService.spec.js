const priceService = require("../priceService");
const { assert } = require('chai')

describe('integration test for registry', function () {
    process.env.IS_OFFLINE = "true";

    it('returns a valid price', async () => {
        
        const price = await priceService.getPrice();
        assert(price > 0 && price < 1, JSON.stringify(price))
        
    })
})