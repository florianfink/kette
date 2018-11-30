"use strict";

const { createAwsResponse } = require("./modules/awsHelper");
const { getPrice } = require("./price/priceService");

module.exports.getPrice = async () => {

    const result = await getPrice();
    const response = createAwsResponse(result);
    return response;

}
