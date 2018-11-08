const makeDependencies = require("./bikeServiceForDependencyMaker");

exports.makeGetBikesFor = (deps) => {

    if(!deps) deps = makeDependencies();

    const getBikeFors = async (userId, apiKey) => {
        try {

            const apiKeyMapping = await deps.apiKeyRepository.get(apiKey);
            const userRecord = await deps.userRepository.get(userId);

            if (userRecord.creatorId !== apiKeyMapping.userId) {
                return {
                    hasError: true,
                    message: "not allowed to read user"
                }
            }

            return await smartContractService.getBikes(userRecord.ethAddress);

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }
    }
    return getBikeFors;
}