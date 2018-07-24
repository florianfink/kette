const assert = require("assert");

exports.makeCreateUser = function (cognitoIdentityServiceProvider) {
    
    assert(cognitoIdentityServiceProvider, "cognitoIdentityServiceProvider not set");
    assert(cognitoIdentityServiceProvider.adminCreateUser, "adminCreateUser not set");

    const createUser = async function (user) {

        try {
            var params = {
                UserPoolId: process.env.USERPOOL_ID,
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

            const createUserResult = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();

            return {
                userId: createUserResult.User.Username
            };

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }
    }

    return createUser;
}


exports.makeGetUser = function (cognitoIdentityServiceProvider) {
    assert(cognitoIdentityServiceProvider, "cognitoIdentityServiceProvider not set");
    assert(cognitoIdentityServiceProvider.adminGetUser, "adminGetUser not set");

    const getUser = async function (userId) {
        try {

            var params = {
                UserPoolId: process.env.USERPOOL_ID,
                Username: userId
            };

            const getUserResult = await cognitoIdentityServiceProvider.adminGetUser(params).promise();
            return getUserResult;

        } catch (error) {
            return {
                hasError: true,
                message: error.message
            }
        }
    }

    return getUser;
}