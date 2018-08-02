const assert = require("assert");

exports.makeCreateApiKey = (deps) => {
    assert(deps.extractUserId, "extractUserId missing");
    assert(deps.internalCreateApiKey, "internalCreateApiKey missing");
    assert(deps.apiKeyRepository, "apiKeyRepository is missing");

    const createApiKey = async function createApiKey(cognitoAuthenticationProvider) {

        try {
            const userId = deps.extractUserId(cognitoAuthenticationProvider);
            const apiKey = await deps.internalCreateApiKey();
            const apiKeyUserIdMapping = {
                apiKey: apiKey.apiKey,
                userId: userId,
                apiKeyId : apiKey.apiKeyId,
                usagePlanKeyId : apiKey.usagePlanKeyId
            };

            await deps.apiKeyRepository.save(apiKeyUserIdMapping);

            return { apiKey: apiKey };

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }
    }

    return createApiKey;
}
