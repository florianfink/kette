exports.convert = (transactions) => {

    const assets = transactions.reduce(function (allAssets, currentTransaction) {

        const existing = allAssets.find(asset => asset.uniqueAssetId === currentTransaction.uniqueAssetId);
        if (existing) {
            existing.assetTransactions.push({
                id: currentTransaction.id,
                action: currentTransaction.action,
                date: currentTransaction.date,
                blockchainRecordId: currentTransaction.blockchainRecordId,
                status: currentTransaction.status
            })
        } else {
            allAssets.push({
                uniqueAssetId: currentTransaction.uniqueAssetId,
                assetType: currentTransaction.assetType,
                assetTransactions: [{
                    id: currentTransaction.id,
                    action: currentTransaction.action,
                    date: currentTransaction.date,
                    blockchainRecordId: currentTransaction.blockchainRecordId,
                    status: currentTransaction.status
                }]
            })
        }
        return allAssets;
    }, []);

    return assets
}