const makeUserRecordRepository = require("../../modules/src/userRepository");
const makeEncryptionService = require("../../modules/src/encryptionService");
const cryptoFunctions = require("../../modules/src/cryptoFunctions");

const AWS = require('aws-sdk');

module.exports = () => {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeRealDependencies() {
    return {
        encryptionService: makeEncryptionService(new AWS.KMS()),
        cryptoFunctions: cryptoFunctions,
        userRecordRepository: makeUserRecordRepository(new AWS.DynamoDB.DocumentClient()),
    }
}

function makeMockDependencies() {

    return {
        encryptionService: {
            encrypt: (input) => { return Buffer.from(input).toString('base64'); },
            decrypt: (input) => { return Buffer.from(input, 'base64').toString('utf8') },
        },
        cryptoFunctions: cryptoFunctions,
        userRecordRepository: makeUserRecordRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    }
}