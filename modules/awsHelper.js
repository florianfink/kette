const assert = require("assert");

module.exports.extractUserId = (cognitoAuthenticationProvider) => {

    if (process.env.IS_OFFLINE === 'true') {
        return "OfflineUser_Id";
    }
    else {
        const splitted = cognitoAuthenticationProvider.split(":");
        const userId = splitted[2];
        assert(userId, "userId could not be extracted from: " + cognitoAuthenticationProvider);
        return userId;
    }
}

module.exports.extractApiKey = (event) => {

    if (process.env.IS_OFFLINE === 'true') {
        return process.env.OFFLINE_APIKEY;
    }
    else {
        return event.requestContext.identity.apiKey
    }
}

module.exports.createAwsResponse = (result) => {

    let statusCode;
    let body;
    if (result.hasError) {
        statusCode = 400;
        body = JSON.stringify({ error: result.message });
        console.log("ERROR: " + result.message);
    } else {
        statusCode = 200;
        body = JSON.stringify(result);
    }

    const response = {
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": true
        },
        statusCode: statusCode,
        body: body
    }

    return response;
}