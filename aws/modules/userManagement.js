var AWS = require('aws-sdk');

exports.makeCreateUser = function (secrets, config) {

    const createUser = async function (user) {

        try {
            AWS.config.update({ accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });

            var params = {
                UserPoolId: config.awsUserPoolId,
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

            var cognitoIdentityServiceProvider = new AWS.CognitoIdentityServiceProvider({ region: config.awsRegion });
            const createUserResult = await cognitoIdentityServiceProvider.adminCreateUser(params).promise();
            
            return {
                userId : createUserResult.sub
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