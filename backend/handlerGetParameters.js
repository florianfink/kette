
"use strict";

const awsHelper = require("./modules/src/awsHelper");
const AWS = require('aws-sdk');
const makeEncryptionService = require("./modules/src/encryptionService");

const userManagement = require("./modules/src/userManagement");
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

    const encryptionService = makeEncryptionService(new AWS.KMS());

    const privateKey = "This is my private key: 5";

    const encryptedKey = await encryptionService.encrypt(privateKey);
    const decryptedKey = await encryptionService.decrypt(encryptedKey);

    const result = {
        privateKey : privateKey,
        encryptedKey : encryptedKey,
        decryptedKey : decryptedKey
    }*/

    const createUser = userManagement.makeCreateUser(new AWS.CognitoIdentityServiceProvider());
    const getUser = userManagement.makeGetUser(new AWS.CognitoIdentityServiceProvider());

    const userInformation = {
        email: "niclas@glieckase2.oi",
        firstName: "Niclas",
        lastName: "lieckase",
        address: "Street Address Life"
    }

    const createdUser = await createUser(userInformation);
    const retrievedUser = await getUser(createdUser.userId);

    const result = {
        createdUser : createdUser,
        retrievedUser : retrievedUser
    }

    const response = awsHelper.createAwsResponse(result);
    callback(null, response);

}
