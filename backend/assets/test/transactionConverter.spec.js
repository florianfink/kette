const expect = require('chai').expect;
const transformer = require('../src/transactionConverter');


it('should transform transactions into assets', () => {
    
    const transaction1 = {
        id: "Id1",
        assetType: "bicycle",
        uniqueAssetId: "uniqueFrameNumber1",
        action: "register",
        ethAddress: "ethAddress1",
        blockchainRecordId: "1",
        status: "pending",
        date: new Date(),
        signedMessage: "lol"
    }

    const transaction2 = {
        id: "Id2",
        assetType: "bicycle",
        uniqueAssetId: "uniqueFrameNumber1",
        action: "transfer",
        ethAddress: "ethAddress1",
        blockchainRecordId: "2",
        status: "pending",
        date: new Date(),
        signedMessage: "lol"
    }

    const transaction3 = {
        id: "Id3",
        assetType: "bicycle",
        uniqueAssetId: "uniqueFrameNumber2",
        action: "register",
        ethAddress: "ethAddress1",
        blockchainRecordId: "3",
        status: "pending",
        date: new Date(),
        signedMessage: "lol"
    }

    const expectedResult = [
        {
            uniqueAssetId: "uniqueFrameNumber1",
            assetType: "bicycle",
            assetTransactions: [{
                action: transaction1.action,
                date: transaction1.date,
                blockchainRecordId: transaction1.blockchainRecordId,
                id: transaction1.id,
                status: transaction1.status
            },{
                action: transaction2.action,
                date: transaction2.date,
                blockchainRecordId: transaction2.blockchainRecordId,
                id: transaction2.id,
                status: transaction2.status
            }
        ]
        },
        {
            uniqueAssetId: "uniqueFrameNumber2",
            assetType: "bicycle",
            assetTransactions: [{
                action: transaction3.action,
                date: transaction3.date,
                blockchainRecordId: transaction3.blockchainRecordId,
                id: transaction3.id,
                status: transaction3.status
            }]
        }]

    
    const transactions = [transaction1, transaction2, transaction3]

    const assets = transformer.transform(transactions);

    expect(assets).to.deep.equal(expectedResult);
})