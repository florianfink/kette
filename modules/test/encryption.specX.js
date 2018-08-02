//"mocha -- */test/*.specX.js"

const cryptoFunctions = require('../src/cryptoFunctions');
const makeCrypto = require("../src/encryption");
const secrets = require("../../secrets");
const config = require("../../config");

const expect = require('chai').expect;

it('is only used to call encryption', async () => {

    var crypto = makeCrypto(secrets, config);
    const key = cryptoFunctions.generateNewKey();

    const encrypted = await crypto.encrypt(key.privateKeyString);
    const decrypted = await crypto.decrypt(encrypted);

    expect(decrypted, "encryption and decryption failed").to.be.equal(key.privateKeyString);
})