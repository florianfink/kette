var AWS = require('aws-sdk');
const assert = require("assert");

exports.makeInternalCreateApiKey = function (apiGateway, awsUsagePlanId) {
    assert(apiGateway, "apiGateway not set");
    assert(awsUsagePlanId, "awsUsagePlanId not set");

    const internalCreateApiKey = async function () {

        var apiKeyParams = {
            enabled: true
        };

        const createApiKeyResult = await apiGateway.createApiKey(apiKeyParams).promise();
        
        var usagePlanParams = {
            keyId: createApiKeyResult.id,
            keyType: 'API_KEY',
            usagePlanId: awsUsagePlanId
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