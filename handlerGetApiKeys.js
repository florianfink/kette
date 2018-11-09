"use strict";

const { createAwsResponse, extractUserId } = require("./modules/src/awsHelper");
const getApiKeys = require("./apiKeys/apiKeysGetter").makeGetApiKeys();

module.exports.getApiKeys = async (event) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    const userId = extractUserId(cognitoAuthenticationProvider);
    const result = await getApiKeys(userId);
    const response = createAwsResponse(result);

    return response;
    
}
