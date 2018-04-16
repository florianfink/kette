var AWS = require('aws-sdk');

exports.makeCreateUser = function (secrets) {

    const createUser = async function (user) {
        AWS.config.update({ accessKeyId: secrets.accessKeyId, secretAccessKey: secrets.secretAccessKey });

        var params = {
            UserPoolId: "us-east-1_ptfudUdBB",
            Username: user.email,
            DesiredDeliveryMediums: ["EMAIL"],
            ForceAliasCreation: false,
            TemporaryPassword: "tempPassword1234!",
            UserAttributes: [
                { Name: "given_name", Value: user.firstName },
                { Name: "family_name", Value: user.lastName },
                { Name: "name", Value: user.firstName + " " + user.lastName },
                { Name: "email", Value: user.email },
                { Name: "address", Value: user.address },
                { Name: "email_verified", Value: "true" }
            ]
        };

        console.log("Sending params to cognito: " + JSON.stringify(params));

        var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: "us-east-1" });
        const createUserResult = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
        return createUserResult;
    }
    return createUser;
}