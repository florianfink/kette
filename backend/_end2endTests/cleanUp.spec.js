global.fetch = require('node-fetch');

global.localStorage = {
    store: {},
    getItem: function (key) {
        return this.store[key]
    },
    setItem: function (key, value) {
        this.store[key] = value
    },
    removeItem: function (key) {
        delete this.store[key]
    }
};

global.window = global.window || {
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    WebSocket: global.WebSocket,
    ArrayBuffer: global.ArrayBuffer,
    addEventListener: function () { },
    navigator: { onLine: true },
    localStorage: global.localStorage
};


const expect = require('chai').expect;
const Amplify = require("aws-amplify").default;
const secrets = require("../secrets");
const awsConfig = require("./awsConfig")
const amplifyConfig = require("./amplifyConfig")
const AWS = require('aws-sdk');

const eMail = "nix@doesnotExist.iy";


describe('...', function () {
    this.timeout(15000);

    it('[Delete User]', async () => {

        var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: awsConfig.cognito.REGION, accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });

        const tempPassword = "LolOlo123123!"

        var params = {
            UserPoolId: awsConfig.cognito.USER_POOL_ID,
            Username: eMail,
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            TemporaryPassword: tempPassword,
            UserAttributes: [
                { Name: "email", Value: eMail },
                { Name: "email_verified", Value: "true" }
            ]
        };

        const createUserResult = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();

        console.log(createUserResult.User.Username);

        var deleteUserParams = {
            UserPoolId: awsConfig.cognito.USER_POOL_ID,
            Username: createUserResult.User.Username
        };

        const deleteUserResult = await cognitoIdentityServiceProvider.adminDeleteUser(deleteUserParams).promise();
        console.log(deleteUserResult)
    })
})
