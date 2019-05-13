"use strict";

const {createAwsResponse } = require("./modules/awsHelper");
const getBikes = require("./bikes/get/bikeGetter").makeGetBikes();

module.exports.getBikes = async (event) => {

    const ethAddress = event.pathParameters.ethAddress;
    const result = await getBikes(ethAddress);
    const response = createAwsResponse(result);
    return response;

}
