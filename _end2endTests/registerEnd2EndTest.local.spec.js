const fetch = require("node-fetch");
const expect = require('chai').expect;
const secrets = require("../secrets");

const url = "http://localhost:3000";

describe('serverless offline register test', function () {

    it('register user with new asset and update transaction', async () => {

        //prepare -------------------------------------------------------------------------------------------------------
        const uniqueAssetId = makeRandomString();
        const assetType = "bicycle";

        const registrationData = {
            uniqueAssetId: uniqueAssetId,
            assetType: assetType
        }

        const init = {
            body: JSON.stringify(registrationData),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        };

        //act -------------------------------------------------------------------------------------------------------

        const registerResponse = await fetch(url + "/register", init)
        expect(registerResponse.status).to.equal(200, "request not succesful");

        const registerResult = await registerResponse.json();

        //check -------------------------------------------------------------------------------------------------------
        expect(registerResult.error, "there was an error").to.be.undefined;


        
        const blockchainRecordId = registerResult.blockchainRecordId;

        const blockchainRecordReceipt = { id: blockchainRecordId, receipt: { random: "data" } }
        const updateInit = {
            body: JSON.stringify(blockchainRecordReceipt),
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            }
        };

        const updateTransactionResponse = await fetch(url + "/transactions/" + uniqueAssetId + "?ketteSecret=" + secrets.ketteSecret, updateInit);
        expect(updateTransactionResponse.status).to.equal(200, "update transaction not succesful");

        const getAssetsResponse = await fetch(url + "/assets", { method: 'GET', headers: { 'content-type': 'application/json' } });
        const assets = await getAssetsResponse.json();
        const createdAsset = assets.find(x => x.uniqueAssetId === uniqueAssetId);

        expect(createdAsset).not.to.be.undefined;
        expect(createdAsset.assetType).to.equal(assetType);
        
        const assetTransaction = createdAsset.assetTransactions.find(x => x.blockchainRecordId === blockchainRecordId);
        expect(assetTransaction).not.to.be.undefined;
        expect(assetTransaction.status).to.be.equal("confirmed");
    })
})

function makeRandomString() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}