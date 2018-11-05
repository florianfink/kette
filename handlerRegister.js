"use strict";
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const register = require("./register/registryWithCreditCard").register;
const secrets = register("./secrets");

module.exports.register = async (event) => {

  const { stripeToken, ipfsHash, description, uniqueId, bikeOwnerAccount, ketteSecret } = JSON.parse(event.body);
  
  if (ketteSecret !== secrets.ketteSecret) {
    const response = createAwsResponse({ hasError: true, message: "not allowed" });
    return response;
  }

  const result = await register(
    uniqueId,
    description,
    ipfsHash,
    bikeOwnerAccount,
    stripeToken
  );
  const response = createAwsResponse(result);
  return response;

}