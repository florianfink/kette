/*
*    B2B endpoint for registerd registrators to get all users that were created by them
*/

"use strict";

const AWS = require('aws-sdk');
const makeApiKeyRepository = require("./modules/src/apiKeyRepository");
const makePrivateRepository = require("./modules/src/privateRepository");
const config = require("./config");
const secrets = require("./secrets");

module.exports.getUsers = async (event, context, callback) => {

    
    const apiKey = event.requestContext.identity.apiKey;
    const apiKeyRepository = makeApiKeyRepository(createDynamoDb());
    const apiKeyUserIdMapping = await apiKeyRepository.get(apiKey);

    const privateRepository = makePrivateRepository(createDynamoDb());
    const users = await privateRepository.findByCreatorId(apiKeyUserIdMapping.userId);

    //const users = [{ userId: '23006f6f-3836-405c-b3dc-17c8e8be78ac' }, {userId : "200531c7-268e-44c5-a412-efa65751c605"}, {userId : "ed280aef-c2ac-4878-8353-8208af64069b"}]

    const cognitoUserPromises = users.map(async (user) => {
        return await getUser(user.userId);   
    });

    const cognitoUsers = await Promise.all(cognitoUserPromises);

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: 200,
        body: JSON.stringify(cognitoUsers)
    }

    callback(null, response);
}


function createDynamoDb() {
    let dynamoDb;
    if (process.env.IS_OFFLINE === 'true') {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: 'localhost', endpoint: 'http://localhost:8000' })
    }
    else {
        dynamoDb = new AWS.DynamoDB.DocumentClient({ region: config.awsRegion });
    }
    return dynamoDb;
}

async function getUser(userId) {

    try {
        const init = {
            region: config.awsRegion,
            accessKeyId: secrets.awsAccessKeyId,
            secretAccessKey: secrets.awsSecretAccessKey
        }
        var params = {
            UserPoolId: config.awsUserPoolId,
            Username: userId
        };

        var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider(init);
        const getUserResult = await cognitoIdentityServiceProvider.adminGetUser(params).promise();

        return getUserResult

    } catch (error) {
        return {
            hasError: true,
            message: error.message
        }
    }
}