/*
*    B2B endpoint for registerd registrators to get all users that were created by them
*/

"use strict";

const assert = require("assert");
const makePublicRepository = require("./modules/src/publicRepository");
const makePrivateRepository = require("./modules/src/privateRepository");

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