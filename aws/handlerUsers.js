/*
*    B2B endpoint for registerd registrators to get all users that where created by them
*/

"use strict";
const AWS = require('aws-sdk');
const assert = require("assert");
const makePublicRepository = require("./register/src/publicRepository");
const makePrivateRepository = require("./register/src/privateRepository");

module.exports.getUsers = async (event, context, callback) => {

    const creatorId = event.requestContext.identity.apiKey;

    const privateRepository = makePrivateRepository();
    const users = await privateRepository.findByCreatorId(creatorId);

    const response = {
        statusCode: 200,
        body: JSON.stringify(users)
    }
    
    callback(null, response);
}