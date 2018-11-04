const assert = require("assert");

module.exports.makeGetAssets = (deps) => {
    assert(deps, "deps not set");
    assert(deps.blockchainService, "transactionRepository not set");
    assert(deps.userRepository, "userRepository not set");

    const getAssets = async (ethAddress) => {

        try {
            const bicycles = await deps.blockchainService.findByEthAddress(ethAddress);
            return bicycles;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }

    }
    return getAssets;
}