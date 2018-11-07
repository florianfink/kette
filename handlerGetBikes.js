"use strict";

const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const getBikes = require("./bikes/bikeGetter").makeGetBikes();

module.exports.getBikes = async (event) => {

    const ethAddress = event.pathParameters.ethAddress;
    const result = await getBikes(ethAddress);
    const response = createAwsResponse(result);
    return response;

}
