/*
*  B2C endpoint register an asset
*/

"use strict";
const makeRegister = require("./register/src/registry").makeRegister;
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const extractUserId = require("./modules/src/awsHelper").extractUserId;
const makeDependencies = require("./register/src/registryDependencyMaker").makeDependencies;

module.exports.register = async (event) => {

  const input = JSON.parse(event.body);

  const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  const userId = extractUserId(cognitoAuthenticationProvider);

  input.userId = userId;
  const creatorId = userId;

  const dependencies = makeDependencies();
  const register = makeRegister(dependencies);

  const result = await register(input, creatorId);

  const response = createAwsResponse(result);
  return response
}