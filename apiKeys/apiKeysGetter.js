const makeDependencies = require("./apiKeysGetterDependecyMaker");

module.exports.makeGetApiKeys = (deps) => {
    
    if(!deps) deps = makeDependencies();
    
    const getApiKeys = async (userId) => {

        try {
            const apiKeys = await deps.apiKeyRepository.findByUserId(userId);
            return apiKeys;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }

    }
    return getApiKeys;
}