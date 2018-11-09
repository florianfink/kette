const fetch = require("node-fetch");
const { assert } = require('chai')

const url = "http://localhost:3000";

describe('get price', function () {

    it('returns reasonable price', async () => {

        //act -------------------------------------------------------------------------------------------------------
        const priceResponse = await fetch(url + "/price", { method: 'GET', headers: { 'content-type': 'application/json' } });

        //check -------------------------------------------------------------------------------------------------------
        const result = await priceResponse.json();
        const {priceInEuro} = result;
        assert(priceInEuro > 0 && priceInEuro < 1, JSON.stringify(result))
    })
})