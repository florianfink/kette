/*
*  B2B endpoint for B2B users to register an asset on behalf of one of their clients (B2B-User)
*/

"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");

const makeRegister = require("./register/src/registryNew").makeRegister;
const makeCreateBlockchainRecord = require("./register/src/blockchainService").makeCreateBlockchainRecord;

const makeTransactionRepository = require("./modules/src/transactionRepository");
const makeUserRecordRepository = require("./modules/src/privateRepository");
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makeEncryptionService = require("./modules/src/encryptionService");
const cryptoFunctions = require("./modules/src/cryptoFunctions");
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const AWS = require('aws-sdk');
const Stampery = require('stampery');

module.exports.register = async (event) => {

  const input = JSON.parse(event.body);
  const creatorId = event.requestContext.identity.apiKey;

  const dependencies = makeDependencies();
  const register = makeRegister(dependencies);
  const result = await register(input, creatorId);
  const response = createAwsResponse(result);

  return response;
}

function makeDependencies() {
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
    apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient()),
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
        //arbitrary number
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
    apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
  }
}