
"use strict";

const awsHelper = require("./modules/src/awsHelper");
const AWS = require('aws-sdk');

module.exports.getParameters = async (event, context, callback) => {

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
    }

    const response = awsHelper.createAwsResponse(result);
    callback(null, response);
}