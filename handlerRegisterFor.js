"use strict";

/*
*  B2B endpoint to register an asset on behalf of one of their clients (external user)
*/

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");

const register = require("./register/registry").register;

const makeDependenciesForCreateUserRecord = require("./users/src/userRecordCreatorDependencyMaker").makeDependencies;
const makeGetOrCreateUserRecord = require("./users/src/userRecordCreator").makeGetOrCreateUserRecord;

const extractApiKey = require("./modules/src/awsHelper").extractApiKey;
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const AWS = require('aws-sdk');

module.exports.registerFor = async (event) => {

  const { ipfsHash, description, uniqueId, userId } = event.body;

  const apiKey = extractApiKey(event);
  const apiKeyRepository = createApiKeyRepository();
  
  //TODO: Errorhandling: what if is apiKeyMapping does not exist. 
  const apiKeyMapping = await apiKeyRepository.get(apiKey);
  const creatorId = apiKeyMapping.userId;

  const createUserRecordDependencies = makeDependenciesForCreateUserRecord();
  const getOrCreateUserRecord = makeGetOrCreateUserRecord(createUserRecordDependencies);
  const userRecord = await getOrCreateUserRecord(userId, creatorId);

  const ethAddress = userRecord.ethAddress;

  const result = await register(uniqueId, description, ipfsHash, ethAddress);
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