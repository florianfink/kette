var AWS = require('aws-sdk');
const assert = require("assert");

exports.makeInternalCreateApiKey = function (apiGateway) {
    assert(apiGateway, "apiGateway not set");

    const internalCreateApiKey = async function () {

        var apiKeyParams = {
            enabled: true
        };

        const createApiKeyResult = await apiGateway.createApiKey(apiKeyParams).promise();

        var usagePlanParams = {
            keyId: createApiKeyResult.id,
            keyType: 'API_KEY',
            usagePlanId: process.env.USAGEPLAN_ID
        };

        const usagePlanCreationResult = await apiGateway.createUsagePlanKey(usagePlanParams).promise();

        return {
            apiKey: createApiKeyResult.value,
            apiKeyId: createApiKeyResult.id,
            usagePlanKeyId: usagePlanCreationResult.id
        };

    }
    return internalCreateApiKey;
}