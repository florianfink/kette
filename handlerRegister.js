"use strict";
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const register = require("./register/registry").register;
const chargeCreditCard = require("./register/creditCardCharge").charge;

module.exports.register = async (event) => {

  const { stripeToken, ipfsHash, description, uniqueId, bikeOwnerAccount, ketteSecret } = event.body;
  console.log(process.env.IS_OFFLINE)

  try {
    await chargeCreditCard(1000, stripeToken);
  } catch (e) {
    console.error(e);
    const response = createAwsResponse({ hasError: true, message: "charging the credit card failed" });
    return response;
  }

  input = {
    uniqueAssetId: uniqueId,
    ipfsImageHash: ipfsHash,
    description: description,
    ownerEthAddress: bikeOwnerAccount
  };

  const result = await register(input);

  const response = createAwsResponse(result);
  return response
}