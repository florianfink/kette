const fetch = require("node-fetch");

exports.getEthPriceInEuro = async function () {
    
    const priceResponse = await fetch(
        "https://api.coinbase.com/v2/prices/ETH-EUR/spot",
         { method: 'GET', headers: { 'content-type': 'application/json' } });
    const result = await priceResponse.json();
    const etherPrice = result.data.amount;
    return etherPrice;
}