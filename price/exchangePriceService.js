const KrakenClient = require('kraken-api');
const kraken = new KrakenClient("key", "secret");

exports.getEthPriceInEuro = async function () {
    
    const etherPriceTicker = await kraken.api('Ticker', { pair: 'XETHZEUR' });
    const etherPrice = etherPriceTicker.result.XETHZEUR.a[0];
    return etherPrice;
    
}