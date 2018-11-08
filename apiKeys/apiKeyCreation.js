const makeDependencies = require("./apiKeyCreationDependencyMaker");
const assert = require("assert");

exports.makeCreateApiKey = (deps) => {
    
    if(!deps) deps = makeDependencies();

    const createApiKey = async function createApiKey(userId) {
        assert(userId, "userId not set")

        try {
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
