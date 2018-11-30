const expect = require('chai').expect;
const cryptoFunctions = require('../cryptoFunctions');

describe("cryptoFunctions", () => {
    it('[sign] -> should sign a message', () => {
        const key = cryptoFunctions.generateNewKey();

        const messageToSign = {
            action: "register",
            assetType: "bike",
            uniqueId: "1337"
        }

        const signedMessage = cryptoFunctions.sign(JSON.stringify(messageToSign), key.privateKey);
        expect(signedMessage).not.to.be.null;
    })

    it('[toPrivateKeyBuffer] -> recreate private key buffer from string', () => {
        const key = cryptoFunctions.generateNewKey();
        const privateKeyBufferFromString = cryptoFunctions.toPrivateKeyBuffer(key.privateKeyString);
        expect(key.privateKey, "keys are not the same").to.be.deep.equal(privateKeyBufferFromString)
    })
})