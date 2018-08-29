const expect = require('chai').expect;
const makeUpdateTransaction = require('../src/transactionUpdater').makeUpdateTransaction;

describe("transcactionUpdater", () => {

    it('should insert a receipt to the transaction without receipts', async () => {

        const expectedUniqueAssetId = "my unique Asset Id that I expect";
        const expectedBlockchainRecordId = "blockchainRecordId that I expect";

        const deps = getTestDependencies("secret", { receipts: undefined }, expectedUniqueAssetId, expectedBlockchainRecordId);

        const expectedReceipt = { proof: "much wow. Blockchain says YES" }
        const updateTransaction = makeUpdateTransaction(deps.transactionRepository, deps.secrets);
        const result = await updateTransaction("secret", expectedUniqueAssetId, { id: expectedBlockchainRecordId, receipt: expectedReceipt });

        expect(result.hasError, result.message).to.be.undefined;
        expect(result.transaction.receipts, "receipts is undefined").to.be.not.undefined;
        expect(result.transaction.receipts).contains(expectedReceipt);
    })

    it('should append receipt to a transaction with existing receipts', async () => {

        const expectedUniqueAssetId = "my unique Asset Id that is suspect";
        const expectedBlockchainRecordId = "blockchainRecordId that I expect";

        const existingReceipts = [{ someData: "ok", randomNumber: 1 }, { someData: "wow", randomNumber: 2 }]

        const deps = getTestDependencies("secret", { receipts: existingReceipts.concat([]) }, expectedUniqueAssetId, expectedBlockchainRecordId);

        const updateTransaction = makeUpdateTransaction(deps.transactionRepository, deps.secrets);

        const expectedReceipt = { proof: "much wow. Blockchain says YES" }
        const result = await updateTransaction("secret", expectedUniqueAssetId, { receipt: expectedReceipt, id: expectedBlockchainRecordId });

        expect(result.hasError, result.message).to.be.undefined;
        expect(result.transaction.receipts, "receipts is undefined").to.be.not.undefined;
        const expectedReceipts = existingReceipts.concat([expectedReceipt])

        expect(result.transaction.receipts).to.deep.equal(expectedReceipts);
    })
})


function getTestDependencies(secret, expectedTransaction, expectedUniqueAssetId, expectedBlockchainRecordId) {
    return {
        transactionRepository: {
            get: (uniqueAssetId, blockchainRecordId) => {
                expect(uniqueAssetId).to.be.equal(expectedUniqueAssetId)
                expect(blockchainRecordId).to.be.equal(expectedBlockchainRecordId)
                return expectedTransaction
            },
            save: (transaction) => {

            }
        },
        secrets: { ketteSecret: secret }
    }
}