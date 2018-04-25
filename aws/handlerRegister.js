/*
*  B2B endpoint for registerd registrators to register an asset on behalf of one of their clients
*/

"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const config = require("./config");
const fetch = require("node-fetch");

const makeRegister = require("./register/src/registry").makeRegister;
const makeCreateBlockchainRecord = require("./register/src/tierionConnector").makeCreateBlockchainRecord;
const makeCreateUser = require("./register/src/userManagement").makeCreateUser;

const makePublicRepository = require("./modules/src/publicRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const cryptoFunctions = require("./modules/src/cryptoFunctions");

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
  return {
    cryptoFunctions: cryptoFunctions,
    createBlockchainRecord: makeCreateBlockchainRecord(secrets, fetch),
    createUser: makeCreateUser(secrets, config),
    publicRepository: makePublicRepository(),
    privateRepository: makePrivateRepository()
  }
}

function makeMockDependencies() {
  return {
    cryptoFunctions: cryptoFunctions,
    createBlockchainRecord: (signedMessage) => {
      console.log("createBlockchainRecord called");
      return { id: "blockchainrecordId " + Math.random(), data: { message: signedMessage }, status: "pending", timestamp: 1231254235345 }
    },
    createUser: (userInfo) => {
      const userId = "user " + Math.random();
      console.log("create user called: "+ userId);
      return { userId: userId }
    },
    publicRepository: makePublicRepository(),
    privateRepository: makePrivateRepository()
  }
}