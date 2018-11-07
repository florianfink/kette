const smartContractService = require("../modules/src/smartContractService");

module.exports.makeGetBikes = () => {

    const getAssets = async (ethAddress) => {

        try {
            const bicycles = await smartContractService.getBikes(ethAddress);
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