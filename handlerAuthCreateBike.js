"use strict";
const createBike = require("./bikes/create/authCreateBike").makeCreateBike();
const {createAwsResponse, extractApiKey} = require("./modules/awsHelper")

module.exports.createBike = async (event) => {

  const { vendor, serialNumber, frameNumber, ipfsHash, userId } = JSON.parse(event.body);

  const apiKey = extractApiKey(event);

  const result = await createBike(
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
