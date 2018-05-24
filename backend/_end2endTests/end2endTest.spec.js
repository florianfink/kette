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

const eMail = "nix2@doesnotExist.iy";
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

        Amplify.configure(amplifyConfig);
        const user = await Amplify.Auth.signIn(eMail, tempPassword);
        await Amplify.Auth.completeNewPassword(user, finalPassword);

        const createdApiKey = await Amplify.API.post("apiKeys", "/apiKeys");

        const apiKey = createdApiKey.apiKey.apiKey;
        console.log(apiKey);

        //wait one minute to let the aws system recognize the newly created API-Key as valid
        await new Promise(resolve => setTimeout(resolve, 60000));

        const registrationData = {
            firstName: "Peter",
            lastName: "Lustig",
            uniqueAssetId: "DiesDasAnanas",
            assetType: "bicycle",
            street: "Kingstreet",
            zipcode: "12345",
            city: "Boss City",
            country: "Germany",
            email: "info@kette.io"
        }

        const init = {
            body: JSON.stringify(registrationData),
            method: 'POST',
            headers: {
                'x-api-key': apiKey,
                'content-type': 'application/json'
            }
        };

        const registerResponse = await fetch("https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev/register", init)
        const registerResult = await registerResponse.json();

        console.log(registerResult);

    }),

        it('[register with existing B2C user]', async () => {
            /*
            const registrationData = {
                firstName : "Peter",
                lastName : "Lustig",
                uniqueAssetId : "DiesDasAnanas",
                assetType : "bicycle",
                street : "Kingstreet",
                zipcode : "12345",
                city : "Boss City",
                country : "Germany",
                email : "info@kette.io"
            }

            Amplify.configure(amplifyConfig);

            await Amplify.Auth.signIn(eMail, finalPassword);
            const apiKeys = await Amplify.API.get("apiKeys", "/apiKeys");

            const firstApiKey = apiKeys[0];
            const apiKey = firstApiKey.apiKey;

            console.log(apiKey)

            const init = {
                body: JSON.stringify(registrationData),
                method: 'POST',
                headers: {
                    'x-api-key': apiKey,
                    'content-type': 'application/json'
                }
            };
            const registerResponse = await fetch("https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev/register", init)
            const registerResult = await registerResponse.json();

            console.log(registerResult);*/
        })
})
