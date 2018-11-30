const { makeInternalCreateApiKey } = require("./apiKeyManagement");
const makeApiKeyRepository = require("../modules/apiKeyRepository");
const AWS = require('aws-sdk');

module.exports = () => {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeMockDependencies() {
    const apiGatewayMock = {
        createApiKey: (params) => {
            return { promise: () => { return { value: process.env.OFFLINE_APIKEY, id: "offline_no_id" } } }
        },
        createUsagePlanKey: (params) => {
            return { promise: () => { return { id: "usagePlanKeyId for test" } } }
        }
    };

    return {
        internalCreateApiKey: makeInternalCreateApiKey(apiGatewayMock),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' }))
    }
}

function makeRealDependencies() {

    return {
        internalCreateApiKey: makeInternalCreateApiKey(new AWS.APIGateway()),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient())
    }
}
