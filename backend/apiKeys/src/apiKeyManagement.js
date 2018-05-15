var AWS = require('aws-sdk');
const assert = require("assert");

exports.makeInternalCreateApiKey = function (apiGateway, awsUsagePlanId) {
    assert(apiGateway, "apiGateway not set");
    assert(awsUsagePlanId, "awsUsagePlanId not set");
    
    const internalCreateApiKey = async function () {

        try {
            var apiKeyParams = {
                enabled: true
            };

            const createApiKeyResult = await apiGateway.createApiKey(apiKeyParams).promise();
            const apiKey = createApiKeyResult.value;

            var usagePlanParams = {
                keyId: createApiKeyResult.id,
                keyType: 'API_KEY',
                usagePlanId: awsUsagePlanId
            };

            const usagePlanCreationResult = await apiGateway.createUsagePlanKey(usagePlanParams).promise();

            return apiKey;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }
    }
    return internalCreateApiKey;
}