const assert = require("assert");

module.exports.makeGetUsers = (deps) => {
    assert(deps, "deps not set");
    assert(deps.apiKeyRepository, "privateRepository not set");
    assert(deps.privateRepository, "privateRepository not set");
    assert(deps.getUser, "getUser not set");

    const getUsers = async (apiKey) => {

        try {
            const apiKeyUserIdMapping = await deps.apiKeyRepository.get(apiKey);
            const users = await deps.privateRepository.findByCreatorId(apiKeyUserIdMapping.userId);
            
            const cognitoUserPromises = users.map(async (user) => {
                return await deps.getUser(user.userId);
            });
        
            const cognitoUsers = await Promise.all(cognitoUserPromises);
            
            return cognitoUsers;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }

    }
    return getUsers;
}