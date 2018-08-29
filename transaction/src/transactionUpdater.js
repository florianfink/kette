const assert = require("assert");

module.exports.makeUpdateTransaction = (transactionRepository, secrets) => {
    assert(transactionRepository, "transactionRepository is missing");
    assert(secrets, "secrets is missing");
    
    const updateTransaction = async (secretInRequest, uniqueAssetId, blockchainRecord) => {

        if (secretInRequest !== secrets.ketteSecret) return { hasError: true, message: "secret does not match: " + secretInRequest };

        const transaction = await transactionRepository.get(uniqueAssetId, blockchainRecord.id);

        if (!transaction) return { hasError: true, message: "secret does not match. " + "Transaction not found. UniqueAssetId: " + uniqueAssetId };

        if (!transaction.receipts) {
            transaction.receipts = [];
        }
        transaction.receipts.push(blockchainRecord.receipt)
        transaction.status = "confirmed";

        await transactionRepository.save(transaction);

        return { transaction: transaction };
    }

    return updateTransaction
}