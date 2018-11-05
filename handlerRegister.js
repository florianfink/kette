"use strict";
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const register = require("./register/registry").register;
const creditCardService = require("./register/creditCardService");
const priceService = require("./price/priceService")

module.exports.register = async (event) => {

  const { stripeToken, ipfsHash, description, uniqueId, bikeOwnerAccount, ketteSecret } = event.body;

  try {

    const { priceInEuro } = await priceService.getPrice();
    const priceInCents = Math.round(priceInEuro * 100);
    await creditCardService.charge(priceInCents, stripeToken);

  } catch (e) {
    console.error(e);
    const response = createAwsResponse({ hasError: true, message: "charging the credit card failed" });
    return response;
  }

  const result = await register(
    uniqueId,
    ipfsHash,
    description,
    bikeOwnerAccount
  );

  const response = createAwsResponse(result);
  return response
}