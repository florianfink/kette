var AWS = require('aws-sdk');
const assert = require("assert");

exports.makeCreateApiKey = function (secrets, config) {
    assert(config.awsRegion, "awsRegion not set");
    assert(secrets.awsAccessKeyId, "awsAccessKeyId not set");
    assert(secrets.awsSecretAccessKey, "awsSecretAccessKey not set");

    const createApiKey = async function () {

        try {
            const options = {
                accessKeyId: secrets.awsAccessKeyId,
                secretAccessKey: secrets.awsSecretAccessKey,
                region: config.awsRegion
            }

            var apiKeyParams = {
                enabled: true
            };

            const apiGateway = new AWS.APIGateway(options);
            const createApiKeyResult = await apiGateway.createApiKey(apiKeyParams).promise();
            const apiKey = createApiKeyResult.value;

            var usagePlanParams = {
                keyId: createApiKeyResult.id,
                keyType: 'API_KEY',
                usagePlanId: secrets.awsUsagePlanId
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

    return createApiKey;
}