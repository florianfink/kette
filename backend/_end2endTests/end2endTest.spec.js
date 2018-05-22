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
    localStorage : global.localStorage
};


const expect = require('chai').expect;
const Amplify = require("aws-amplify").default;

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

        try {
            const signInResult = await Amplify.Auth.signIn("hannes@rang.de", "passwordLol123!");
            const apiKeys = await Amplify.API.get("apiKeys", "/apiKeys");
            console.log(apiKeys);
        }
        catch (e) {
            console.log(e);
        }
    })
})