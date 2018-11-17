"use strict";

const { createAwsResponse } = require("./modules/src/awsHelper");
const smartContractService = require("./modules/src/smartContractService");

module.exports.getBike = async (event) => {

    const vendor = event.queryStringParameters.vendor;
    const serialNumber = event.queryStringParameters.serialNumber;
    const frameNumber = event.queryStringParameters.frameNumber;
    const result = await smartContractService.lookUpBicycle(vendor, serialNumber, frameNumber);
    const response = createAwsResponse(result);
    return response;

}
