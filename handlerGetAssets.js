/*
*    B2C endpoint for B2C-Users to get their registered assets
*/

"use strict";

const makeuserRepository = require("./modules/src/userRepository");
const createAwsResponse = require("./modules/src/awsHelper").createAwsResponse;
const makeGetAssets = require("./assets/src/assetGetter").makeGetAssets;

const AWS = require('aws-sdk');

module.exports.getAssets = async (event) => {

    const ethAddress = event.pathParameters.ethAddress;

    const dependencies = makeDependencies();
    const getAssets = makeGetAssets(dependencies);

    const result = await getAssets(ethAddress);

    const response = createAwsResponse(result);
    return response;
}

function makeDependencies() {
    if (process.env.IS_OFFLINE === 'true') {
        return makeMockDependencies();
    } else {
        return makeRealDependencies();
    }
}

function makeRealDependencies() {
    return {
        blockchainService: {},//todo
    }
}

function makeMockDependencies() {

    return {
        blockchainService: {},//todo
    }
}