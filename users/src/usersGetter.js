const assert = require("assert");

module.exports.makeGetUsers = (deps) => {
    assert(deps, "deps not set");
    assert(deps.apiKeyRepository, "privateRepository not set");
    assert(deps.userRecordRepository, "privateRepository not set");

    const getUsers = async (apiKey) => {

        try {
            const apiKeyUserIdMapping = await deps.apiKeyRepository.get(apiKey);
            const users = await deps.userRecordRepository.findByCreatorId(apiKeyUserIdMapping.userId);
            const userNames = users.map(x => x.userId);
        
            return userNames;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }

    }
    return getUsers;
}