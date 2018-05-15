const assert = require("assert");

const convertTransactions = require("./transactionConverter").convert;

module.exports.makeGetAssets = (deps) => {
    assert(deps, "deps not set");
    assert(deps.privateRepository, "privateRepository not set");
    assert(deps.transactionRepository, "transactionRepository not set");
    assert(deps.privateRepository, "privateRepository not set");

    const getAssets = async (cognitoAuthenticationProvider) => {

        try {
            const userId = deps.extractUserId(cognitoAuthenticationProvider);
            const userRecord = await deps.privateRepository.get(userId);
            const assetTransactions = await deps.transactionRepository.findByEthAddress(userRecord.ethAddress);
            const assets = convertTransactions(assetTransactions);
            return assets;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }

    }
    return getAssets;
}