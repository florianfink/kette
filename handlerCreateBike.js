"use strict";
const { createAwsResponse } = require("./modules/awsHelper");
const { register } = require("./bikes/create/registryWithCreditCard");
const secrets = require("./secrets");

module.exports.createBike = async (event) => {

  const { stripeToken, ipfsHash, vendor, serialNumber, frameNumber, bikeOwnerAccount, ketteSecret } = JSON.parse(event.body);

  if (ketteSecret !== secrets.ketteSecret) {
    const response = createAwsResponse({ hasError: true, message: "not allowed" });
    return response;
  }

  const result = await register(
    vendor, 
    serialNumber, 
    frameNumber, 
    ipfsHash, 
    bikeOwnerAccount, 
    stripeToken);
  
  const response = createAwsResponse(result);
  return response;

}