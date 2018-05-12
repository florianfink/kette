/*
*    B2B endpoint for creators to create their api key to use the register function
*/

"use strict";

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const secrets = require("./secrets");
const config = require("./config");
const AWS = require('aws-sdk');

module.exports.getApiKeys = async (event, context, callback) => {

    const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
    const splitted = cognitoAuthenticationProvider.split(":");
    const userId = splitted[2];

    const apiKeyRepository = makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion }));

    const apiKeys = await apiKeyRepository.findByUserId(userId);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        body: JSON.stringify(apiKeys)
    }
    callback(null, response);
}

