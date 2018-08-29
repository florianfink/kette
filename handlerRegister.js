/*
*  B2C endpoint register an asset
*/

"use strict";
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const extractUserId = require("./modules/src/awsHelper").extractUserId;

const makeDependencies = require("./register/src/registryDependencyMaker").makeDependencies;
const makeRegister = require("./register/src/registry").makeRegister;

const makeDependenciesForCreateUserRecord = require("./users/src/userRecordCreatorDependencyMaker").makeDependencies;
const makeCreateUserRecord = require("./users/src/userRecordCreator").makeCreateUserRecord;

module.exports.register = async (event) => {

  const input = JSON.parse(event.body);

  const cognitoAuthenticationProvider = event.requestContext.identity.cognitoAuthenticationProvider;
  //TODO: better wrapping of argumetns / input
  const userId = extractUserId(cognitoAuthenticationProvider);
  input.userId = userId;

  //TODO: move to outer scope. don´t do while registering
  const createUserRecordDependencies = makeDependenciesForCreateUserRecord();
  const createUserRecord = makeCreateUserRecord(createUserRecordDependencies);
  await createUserRecord(userId, userId);

  const dependencies = makeDependencies();
  const register = makeRegister(dependencies);

  const result = await register(input);

  const response = createAwsResponse(result);
  return response
}
