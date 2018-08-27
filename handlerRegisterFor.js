/*
*  B2B endpoint to register an asset on behalf of one of their clients (external user)
*/

"use strict";

const makeRegister = require("./register/src/registry").makeRegister;
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;

const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makeDependencies = require("./register/src/registryDependencyMaker").makeDependencies;

const AWS = require('aws-sdk');

module.exports.registerFor = async (event) => {

  const input = JSON.parse(event.body);
  const apiKey = event.requestContext.identity.apiKey;

  const dependencies = makeDependencies();

  const apiKeyRepository = createApiKeyRepository();
  
  //TODO: Errorhandling: what if is apiKeyMapping does not exist. 
  const apiKeyMapping = await apiKeyRepository.get(apiKey);
  const creatorId = apiKeyMapping.userId;

  const register = makeRegister(dependencies);
  const result = await register(input, creatorId);
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
