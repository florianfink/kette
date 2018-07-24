module.exports.makeGetApiKeys = (deps) => {

    const getApiKeys = async (cognitoAuthenticationProvider) => {

        try {
            
            const userId = deps.extractUserId(cognitoAuthenticationProvider);
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