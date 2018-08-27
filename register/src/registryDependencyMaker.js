const makeCreateBlockchainRecord = require("./blockchainService").makeCreateBlockchainRecord;

const makeTransactionRepository = require("../../modules/src/transactionRepository");
const makeUserRecordRepository = require("../../modules/src/privateRepository");
const makeEncryptionService = require("../../modules/src/encryptionService");
const cryptoFunctions = require("../../modules/src/cryptoFunctions");
const secrets = require("../../secrets");

const AWS = require('aws-sdk');
const Stampery = require('stampery');

exports.makeDependencies = () => {
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
        createBlockchainRecord: makeCreateBlockchainRecord(new Stampery(secrets.stamperySecret), secrets.ketteSecret),
        transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient()),
        userRecordRepository: makeUserRecordRepository(new AWS.DynamoDB.DocumentClient()),
    }
}

function makeMockDependencies() {

    const mockBlockchainService = {
        hash: (messageToHash) => {
            return Buffer.from(messageToHash).toString('base64').substring(0, 10);
        },
        stamp: (hash, hook) => {
            console.log(hook);
            return {
                id: Buffer.from(hash).toString('base64').substring(0, 10),
                time: "2018-05-10 19:06:00.270483"
            }
        }
    }

    return {
        encryptionService: {
            encrypt: (input) => { return Buffer.from(input).toString('base64'); },
            decrypt: (input) => { return Buffer.from(input, 'base64').toString('utf8') },
        },
        cryptoFunctions: cryptoFunctions,
        createBlockchainRecord: makeCreateBlockchainRecord(mockBlockchainService, secrets.ketteSecret),
        transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        userRecordRepository: makeUserRecordRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    }
}