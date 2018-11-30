const AWS = require('aws-sdk');

const makeApiKeyRepository = require("../modules/apiKeyRepository");
const makeuserRepository = require("../modules/userRepository");
const smartContractService = require("../modules/smartContractService");
module.exports = () => {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeRealDependencies() {
    return {
        userRepository: makeuserRepository(new AWS.DynamoDB.DocumentClient()),
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient()),
        smartContractService : smartContractService
    }
}

function makeMockDependencies() {

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        userRepository: makeuserRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        smartContractService : smartContractService
    }
}