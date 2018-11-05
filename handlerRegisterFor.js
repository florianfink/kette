"use strict";
const register = require("./register/registryForUser").makeRegister();
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const extractApiKey = require("./modules/src/awsHelper").extractApiKey;

module.exports.registerFor = async (event) => {

  const { ipfsHash, description, uniqueId, userId } = JSON.parse(event.body);

  const apiKey = extractApiKey(event);

  const result = await register(
    uniqueId,
    description,
    ipfsHash,
    apiKey,
    userId
  );

  const response = createAwsResponse(result);

  return response;
}
