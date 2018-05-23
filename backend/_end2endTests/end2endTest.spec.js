/*global.fetch = require('node-fetch');

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
*/

const expect = require('chai').expect;
//const Amplify = require("aws-amplify").default;
const secrets = require("../secrets");
var AWS = require('aws-sdk');

describe('...', function () {
    this.timeout(15000);
    it('[End2EndTest]', async () => {
        const config = {
            apiGateway: {
                REGION: "us-east-1",
                URL: "https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev"
            },
            cognito: {
                REGION: "us-east-1",
                USER_POOL_ID: "us-east-1_FkjK4UxZV",
                APP_CLIENT_ID: "7s4qkqr0nrl5uks2hbfmsu787p",
                IDENTITY_POOL_ID: "us-east-1:98c42162-97a8-461c-a8d5-82eb0e4ebdbe"
            }
        };

        try {

            const tempPassword = "LolOlo123123!"

            var params = {
                UserPoolId: config.cognito.USER_POOL_ID,
                Username: "nix@doesnotExist.iy",
                DesiredDeliveryMediums: ["EMAIL"],
                ForceAliasCreation: false,
                TemporaryPassword: tempPassword,
                UserAttributes: [
                    { Name: "email", Value: "nix@doesnotExist.iy" },
                    { Name: "email_verified", Value: "true" }
                ]
            };

            var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: config.cognito.REGION, accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey});
            const createUserResult = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();

            console.log(createUserResult);
            /*
            Amplify.configure({
                Auth: {
                    mandatorySignIn: true,
                    region: config.cognito.REGION,
                    userPoolId: config.cognito.USER_POOL_ID,
                    identityPoolId: config.cognito.IDENTITY_POOL_ID,
                    userPoolWebClientId: config.cognito.APP_CLIENT_ID
                },
                API: {
                    endpoints: [
                        {
                            name: "apiKeys",
                            endpoint: config.apiGateway.URL,
                            region: config.apiGateway.REGION
                        },
                    ]
                }
            })

            await Amplify.Auth.signIn("hannes@rang.de", "passwordLol123!");
            
            const apiKeys = await Amplify.API.get("apiKeys", "/apiKeys");
            const firstApiKey = apiKeys[0];

            const apiKey = firstApiKey.apiKey;
            const init = { headers: { 'x-api-key': apiKey } };
            const getUsersResponse = await fetch("https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev/users", init)
            const users = await getUsersResponse.json();
            
            users.forEach(user => {
                console.log(user.UserAttributes[3].Value)
            });*/

        } catch (e) {
            console.log("ERROR");
            console.log(e);
        }
    })
})