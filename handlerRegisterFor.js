"use strict";

/*
*  B2B endpoint to register an asset on behalf of one of their clients (external user)
*/

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");

const makeDependencies = require("./register/src/registryDependencyMaker").makeDependencies;
const makeRegister = require("./register/src/registry").makeRegister;

const makeDependenciesForCreateUserRecord = require("./users/src/userRecordCreatorDependencyMaker").makeDependencies;
const makeCreateUserRecord = require("./users/src/userRecordCreator").makeCreateUserRecord;

const extractApiKey = require("./modules/src/awsHelper").extractApiKey; 
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const AWS = require('aws-sdk');

module.exports.registerFor = async (event) => {

  const input = JSON.parse(event.body);

  const apiKey = extractApiKey(event);
  const apiKeyRepository = createApiKeyRepository();
  //TODO: Errorhandling: what if is apiKeyMapping does not exist. 
  const apiKeyMapping = await apiKeyRepository.get(apiKey);
  const creatorId = apiKeyMapping.userId;

  //TODO: move to outer scope. don´t do while registering
  const createUserRecordDependencies = makeDependenciesForCreateUserRecord();
  const createUserRecord = makeCreateUserRecord(createUserRecordDependencies);
  await createUserRecord(input.userId, creatorId);

  const dependencies = makeDependencies();
  const register = makeRegister(dependencies);
  const result = await register(input);
  const response = createAwsResponse(result);

  return response;
}

function createApiKeyRepository() {
  if (process.env.IS_OFFLINE === 'true') {
    return makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' }))
  } else {
    return makeApiKeyRepository(new AWS.DynamoDB.DocumentClient())
  }
}