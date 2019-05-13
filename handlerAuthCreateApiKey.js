"use strict";

const createApiKey = require("./apiKeys/apiKeyCreation").makeCreateApiKey();
const {createAwsResponse, extractUserId} = require("./modules/awsHelper");

module.exports.createApiKey = async (event) => {
    
    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    const userId = extractUserId(cognitoAuthenticationProvider);
    const result = await createApiKey(userId);
    const response = createAwsResponse(result);
    
    return response;
}

