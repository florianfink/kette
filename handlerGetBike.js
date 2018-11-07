"use strict";

const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const smartContractService = require("./modules/src/smartContractService");

module.exports.getBike = async (event) => {

    const uniqueId = event.queryStringParameters.uniqueId;
    const result = await smartContractService.getBike(uniqueId);
    const response = createAwsResponse(result);
    return response;
    
}
