"use strict";
const register = require("./register/registryForUser").makeRegister();
const {createAwsResponse, extractApiKey} = require("./modules/awsHelper")

module.exports.registerFor = async (event) => {

  const { vendor, serialNumber, frameNumber, ipfsHash, userId } = JSON.parse(event.body);

  const apiKey = extractApiKey(event);
  console.log("----------------- api key ----------------- ");

  const result = await register(
    vendor,
    serialNumber,
    frameNumber,
    ipfsHash,
    apiKey,
    userId
  );

  const response = createAwsResponse(result);

  return response;
}
