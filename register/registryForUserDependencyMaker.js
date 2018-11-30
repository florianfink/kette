"use strict";

const makeApiKeyRepository = require("../modules/apiKeyRepository");
const { makeGetOrCreateUserRecord } = require("../users/userRecordCreator");
const AWS = require('aws-sdk');

module.exports = () => {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeRealDependencies() {
    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient()),
        getOrCreateUserRecord : makeGetOrCreateUserRecord()
    }
}

function makeMockDependencies() {

    return {
        apiKeyRepository: makeApiKeyRepository(new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })),
        getOrCreateUserRecord : makeGetOrCreateUserRecord()
    }
}