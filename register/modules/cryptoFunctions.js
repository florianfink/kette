"use strict";

var ethUtil = require('ethereumjs-util');
ethUtil.crypto = require('crypto');

exports.sign = function (message, privateKey) {

    var hashedMessage = ethUtil.hashPersonalMessage(ethUtil.toBuffer(message))
    var signed = ethUtil.ecsign(hashedMessage, privateKey)

    var publicKey = this.getPublicKey(privateKey);
    var address = this.getAddressFromPublicKey(publicKey);
    var addressString = this.getAddressString(address);
    
    var combined = Buffer.concat([Buffer.from(signed.r), Buffer.from(signed.s), Buffer.from([signed.v])])
    var combinedHex = combined.toString('hex')
    var result = JSON.stringify({
        address: addressString,
        msg: message,
        sig: '0x' + combinedHex,
        version: '2'
    }, null, 2)

    return result;
}

exports.generatePrivateKey = function () {
    var privateKey = ethUtil.crypto.randomBytes(32);
    var finalPrivateKey = Buffer(privateKey, 'hex')
    return finalPrivateKey;
}

exports.getPrivateKeyString = function (privateKey) {
    return privateKey.toString('hex');
}

exports.getPublicKey = function (privateKey) {
    return ethUtil.privateToPublic(privateKey);
}

exports.getAddressFromPublicKey = function (publicKey){
    return ethUtil.publicToAddress(publicKey, true)
}

exports.getAddressString = function (address){
    return '0x' + address.toString('hex')
}

exports.getPublicKeyString = function(publicKey){
    return "0x" + publicKey.toString('hex');
}

exports.generateNewKey = function(){
    const privateKey = this.generatePrivateKey();
    const publicKey = this.getPublicKey(privateKey);
    const address = this.getAddressFromPublicKey(publicKey);
    const addressAsString = this.getAddressString(address);

    return {
        privateKey : privateKey,
        ethAddress : addressAsString
    }
}

// just a function to test all crypto functions
exports.callAllFunctions = function () {
    
    const privateKey = this.generatePrivateKey();
    const publicKey = this.getPublicKey(privateKey);
    const address = this.getAddressFromPublicKey(publicKey);

    const privateKeyString = this.getPrivateKeyString(privateKey);
    const addressString = this.getAddressString(address);

    const signedMessage = this.sign("hihi", privateKey);

    console.log(privateKeyString);
    console.log(addressString);
    console.log(signedMessage);
}