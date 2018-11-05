"use strict";
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const register = require("./register/registryWithCreditCard").register;

module.exports.register = async (event) => {

  const { stripeToken, ipfsHash, description, uniqueId, bikeOwnerAccount, ketteSecret } = event.body;

  if (ketteSecret !== secrets.ketteSecret) {
    const response = createAwsResponse({ hasError: true, message: "not allowed" });
    return response;
  }

  const result = await register(
    uniqueId,
    ipfsHash,
    description,
    bikeOwnerAccount,
    stripeToken
  );

  const response = createAwsResponse(result);
  return response
}