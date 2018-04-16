"use strict";

//secrets is not included in source control and needs to be created locally
const secrets = require("./secrets");
const fetch = require("node-fetch");

const makeRegister = require("./modules/registry").makeRegister;
const cryptoFunctions = require("./modules/cryptoFunctions");

const makeCreateBlockchainRecord = require("./modules/tierionConnector").makeCreateBlockchainRecord;

const makeCreateUser = require("./modules/userManagement").makeCreateUser;

const makePublicRepository = require("./modules/publicRepository");
const makePrivateRepository = require("./modules/privateRepository");

module.exports.register = async (event, context, callback) => {

  const dependencies = makeDependencies();
  //const input = JSON.parse(event.body);  

  try {

    const userToCreate = { firstName: "Fritz", lastName: "Mueller", email: "hannes@rang.de", address: "Klingenstraße 65" };
    var result = await dependencies.createUser(userToCreate);

    /*
    const objectToSave = { userId: input.firstName, privateKey: input.lastName };
    await dependencies.privateRepository.save(objectToSave);
  
    const result = { saved: objectToSave };
  
    const register = makeRegister(dependencies);
    const result = await register({frameNumber : "2345123", email : "klo2@that.de", firstName: "peter", lastName : "pan"});
    */

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
  } catch (error) {
    const response = {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    callback(null, response);
  }
}

function makeDependencies() {
  return {
    cryptoFunctions: cryptoFunctions,
    createBlockchainRecord: makeCreateBlockchainRecord(secrets, fetch),
    createUser: makeCreateUser(secrets),
    publicRepository: makePublicRepository(),
    privateRepository: makePrivateRepository()
  }
}