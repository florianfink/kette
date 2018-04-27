const expect = require('chai').expect;
const cryptoFunctions = require('../src/cryptoFunctions');
var ethUtil = require('ethereumjs-util');

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

    //console.log(JSON.stringify(signedMessageAsObject));
})

it('recreate private key buffer from string', () => {
    const key = cryptoFunctions.generateNewKey();
    
    const privateKeyBufferFromString = cryptoFunctions.toPrivateKeyBuffer(key.privateKeyString);

    expect(key.privateKey, "keys are not the same").to.be.deep.equal(privateKeyBufferFromString)
})
