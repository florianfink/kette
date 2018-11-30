const smartContractService = require("../modules/smartContractService");

module.exports.makeGetBikes = () => {

    const getBikes = async (ethAddress) => {

        try {
            return await smartContractService.getBikes(ethAddress);
        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }

    }
    return getBikes;
}