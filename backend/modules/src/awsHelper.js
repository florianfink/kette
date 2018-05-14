const assert = require("assert");

module.exports.extractUserId = (cognitoAuthenticationProvider) => {

    const splitted = cognitoAuthenticationProvider.split(":");
    const userId = splitted[2];
    assert(userId, "userId could not be extracted from: " + cognitoAuthenticationProvider);
    return userId;

}

module.exports.createAwsResponse = (result) => {

    let statusCode;
    let body;
    if (result.hasError) {
        statusCode = 400;
        body = JSON.stringify({ message: "oops something went wrong" });
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