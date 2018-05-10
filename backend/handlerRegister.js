/*
*  B2B endpoint for registerd registrators to register an asset on behalf of one of their clients
*/

"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const config = require("./config");

const makeRegister = require("./register/src/registry").makeRegister;
const makeCreateBlockchainRecord = require("./register/src/blockchainService").makeCreateBlockchainRecord;
const makeCreateUser = require("./register/src/userManagement").makeCreateUser;

const makeTransactionRepository = require("./modules/src/transactionRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");

const makeEncryptionService = require("./modules/src/encryptionService");

const cryptoFunctions = require("./modules/src/cryptoFunctions");
const AWS = require('aws-sdk');
const Stampery = require('stampery');

module.exports.register = async (event, context, callback) => {

  const input = JSON.parse(event.body);
  const creatorId = event.requestContext.identity.apiKey;

  const dependencies = makeDependencies();

  const register = makeRegister(dependencies);
  const result = await register(input, creatorId);

  if (result.hasError) {
    const response = {
      statusCode: 400,
      body: JSON.stringify(result.message)
    }
    callback(null, response);
  }
  else {
    const response = {
      statusCode: 200,
      body: JSON.stringify(result)
    }
    callback(null, response);
  };
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
    encryptionService: makeEncryptionService(secrets, config),
    cryptoFunctions: cryptoFunctions,
    createBlockchainRecord: makeCreateBlockchainRecord(new Stampery(secrets.stamperySecret), config.webHookUrl, secrets.ketteSecret),
    createUser: makeCreateUser(secrets, config),
    transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })),
    privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })),
    apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: config.awsRegion })),
  }
}

function makeMockDependencies() {

  const mockBlockchainService = {
    hash : (messageToHash) => {
      return Buffer.from(messageToHash).toString('base64').substring(0,10);
    },
    stamp: (hash, hook) => {
      return {
        id : Buffer.from(hash).toString('base64').substring(0,10),
        time : "2018-05-10 19:06:00.270483"
      }
    }
  }
  
  return {
    encryptionService: {
      encrypt: (input) => { return Buffer.from(input).toString('base64'); },
      decrypt: (input) => { return Buffer.from(input, 'base64').toString('utf8') },
    },
    cryptoFunctions: cryptoFunctions,
    createBlockchainRecord: makeCreateBlockchainRecord(mockBlockchainService, config.webHookUrl, secrets.ketteSecret),
    
    createUser: (userInfo) => {
      const userId = "B2C user called user Id: " + Math.random();
      console.log("create user called: " + userId);
      return { userId: userId }
    },
    transactionRepository: makeTransactionRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    privateRepository: makePrivateRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
    apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
  }
}