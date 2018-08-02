const secrets = require("./secrets");
const awsConfig = require("./awsConfig")
const AWS = require('aws-sdk');

const eMail = "info@kette2.io";


describe('...', function () {
    this.timeout(15000);

    it('[Delete User]', async () => {

        var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: awsConfig.cognito.REGION, accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });

        var deleteUserParams = {
            UserPoolId: awsConfig.cognito.USER_POOL_ID,
            Username: eMail
        };

        const deleteUserResult = await cognitoIdentityServiceProvider.adminDeleteUser(deleteUserParams).promise();
        console.log(deleteUserResult)
    })
})
