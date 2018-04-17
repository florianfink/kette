"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const config = require("./config");
const fetch = require("node-fetch");

const makeRegister = require("./modules/registry").makeRegister;
const cryptoFunctions = require("./modules/cryptoFunctions");

const makeCreateBlockchainRecord = require("./modules/tierionConnector").makeCreateBlockchainRecord;

const makeCreateUser = require("./modules/userManagement").makeCreateUser;

const makePublicRepository = require("./modules/publicRepository");
const makePrivateRepository = require("./modules/privateRepository");

module.exports.register = async (event, context, callback) => {

  const input = JSON.parse(event.body);
  const dependencies = makeDependencies();

  const register = makeRegister(dependencies);
  const result = await register(input);

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
  const IS_OFFLINE = process.env.IS_OFFLINE

  if (IS_OFFLINE === 'true') {
    return {
      cryptoFunctions: cryptoFunctions,
      createBlockchainRecord: (signedMessage) => { return { id: "blockchainrecordId", data: { message: signedMessage }, status: "pending", timestamp: 1231254235345 } },
      createUser: (userInfo) => { return { userId: "lölchen" } },
      publicRepository: makePublicRepository(),
      privateRepository: makePrivateRepository()
    }
  } else {
    return {
      cryptoFunctions: cryptoFunctions,
      createBlockchainRecord: makeCreateBlockchainRecord(secrets, fetch),
      createUser: (userInfo) => makeCreateUser(secrets, config),
      publicRepository: makePublicRepository(),
      privateRepository: makePrivateRepository()
    }
  }
}