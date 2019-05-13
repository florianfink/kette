/*
* B2B endpoint to get all registered assets of an user.
*/

"use strict";

const getBikesFor = require("./bikes/get/bikeServiceFor").makeGetBikesFor();
const { createAwsResponse, extractApiKey } = require("./modules/awsHelper");

module.exports.getBikes = async (event) => {

    const userId = event.pathParameters.id;
    const apiKey = extractApiKey(event);

    const result = await getBikesFor(userId, apiKey);

    const response = createAwsResponse(result);
    return response;
}