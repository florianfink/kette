
module.exports.makeUpdateTransaction = (transactionRepository, secrets) => {

    const updateTransaction = async (secretInRequest, transactionId, blockchainReceipt) => {

        if (secretInRequest !== secrets.ketteSecret) return { hasError: true, message: "secret does not match: " + secretInRequest };

        const transaction = await transactionRepository.get(transactionId);

        if (!transaction) return { hasError: true, message: "secret does not match. " + "Transaction not found. Id: " + transactionId };
        if (transaction.blockchainRecordId !== blockchainReceipt.id) return { hasError: true, message: "transaction blockchainRecordId: " + transaction.blockchainId + " and blockchainreceipt id: " + blockchainReceipt.id + "not not match " }

        if (!transaction.receipts) {
            transaction.receipts = [];
        }
        transaction.receipts.push(blockchainReceipt.receipt)
        transaction.status = "confirmed";

        await transactionRepository.save(transaction)

        return { transaction: transaction };
    }

    return updateTransaction
}