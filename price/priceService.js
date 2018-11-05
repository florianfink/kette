"use strict";

const smartContractService = require("../modules/src/smartContractService");
const exchangePriceSerivce = require("./exchangePriceService");

exports.getPrice = async function () {

    try {

        const { priceInEth } = await smartContractService.getRegistrationPrice();
        const ethPriceInEuro = await exchangePriceSerivce.getEthPriceInEuro();

        const basePriceInEuro = priceInEth * ethPriceInEuro;

        //https://stripe.com/de/pricing
        const stripeFee = 0.25;
        const stripePercentageFee = basePriceInEuro * 0.03;

        const priceInEuro = basePriceInEuro + stripeFee + stripePercentageFee;
        const priceInCents = Math.round(priceInEuro * 100);

        return { priceInEuro, priceInCents };

    } catch (error) {
        console.log("error: " + error);
        return {
            hasError: true,
            message: error
        };
    }
}