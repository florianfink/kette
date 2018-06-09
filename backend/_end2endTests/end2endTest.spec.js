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
const secrets = require("./secrets");
const awsConfig = require("./awsConfig")
const amplifyConfig = require("./amplifyConfig")
const AWS = require('aws-sdk');

const eMail = "DiesDas3@kette3.io";
const finalPassword = "D!iesDa1232139";

describe('...', function () {
    this.timeout(300000);
    it('[create new B2B user and register an asset]', async () => {
        
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

        
        var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: awsConfig.cognito.REGION, accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });
        await cognitoIdentityServiceProvider.adminCreateUser(params).promise();

        console.log("B2B user created");

        Amplify.configure(amplifyConfig);
        const user = await Amplify.Auth.signIn(eMail, tempPassword);
        console.log("Signed in");
        await Amplify.Auth.completeNewPassword(user, finalPassword);
        console.log("Password changed");
        const createdApiKey = await Amplify.API.post("apiKeys", "/apiKeys");
        console.log("ApiKey created");
        const apiKey = createdApiKey.apiKey.apiKey;

        //wait one minute to let the aws system recognize the newly created API-Key as valid
        console.log("Waiting 45 seconds for api key to be recognized in AWS system");
        await new Promise(resolve => setTimeout(resolve, 45000));
        console.log("Waiting over");
        const registrationData = {
            firstName: "Peter",
            lastName: "Lustig",
            uniqueAssetId: "DiesDasAn2anas5e",
            assetType: "bicycle",
            street: "Kingstreet",
            zipcode: "12345",
            city: "Boss City",
            country: "Germany",
            email: "diesDas2@kette2.io"
        }

        const init = {
            body: JSON.stringify(registrationData),
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'content-type': 'application/json'
            }
        };

        const url = awsConfig.apiGateway.URL;
        const registerResponse = await fetch(url + "/register", init)
        const registerResult = await registerResponse.json();
        console.log("registration complete");
        
        console.log(registerResult);

    })
})
