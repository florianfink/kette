const cryptoFunctions = require('../modules/cryptoFunctions');



it('should sign a message', () => {
    const key = cryptoFunctions.generateNewKey();

    const messageToSign = {
        action: "register",
        assetType: "bike",
        uniqueId: "1337"
    }

    const signedMessage = cryptoFunctions.sign(JSON.stringify(messageToSign), key.privateKey);
    

    const cosignKey = cryptoFunctions.generateNewKey();

    const messageToCosign = {
        action : "cosign",
        cosigner : "Allverta",
        signature : JSON.parse(signedMessage).sig
    }
    const cosignedMessage = cryptoFunctions.sign(JSON.stringify(messageToCosign), cosignKey.privateKey);

    var signedMessageAsObject = JSON.parse(signedMessage);

    signedMessageAsObject.cosigning = JSON.parse(cosignedMessage);

    console.log(JSON.stringify(signedMessageAsObject));
})
