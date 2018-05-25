
"use strict";

const awsHelper = require("./modules/src/awsHelper");
const AWS = require('aws-sdk');
const makeEncryptionService = require("./modules/src/encryptionService");

module.exports.getParameters = async (event, context, callback) => {

    /*
    var ssm = new AWS.SSM();
    var paramsForUnencrypted = {
        Name: 'normalParameter'
      };

    const np = await ssm.getParameter(paramsForUnencrypted).promise();
    console.log(np);

    var paramsForEncryptedParameter = {
        Name: 'encryptedParameter',
        WithDecryption: true
      };
      
    const ds = await ssm.getParameter(paramsForEncryptedParameter).promise();
    console.log(ds);

    const result = {
        normalParameter : np,
        decryptedSecret : ds
    }*/

    const encryptionService = makeEncryptionService(new AWS.KMS());

    const privateKey = "This is my private key: 5";

    const encryptedKey = await encryptionService.encrypt(privateKey);
    const decryptedKey = await encryptionService.decrypt(encryptedKey);

    const result = {
        privateKey : privateKey,
        encryptedKey : encryptedKey,
        decryptedKey : decryptedKey
    }

    const response = awsHelper.createAwsResponse(result);
    callback(null, response);
}