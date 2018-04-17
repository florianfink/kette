module.exports.getAssets = async (event, context, callback) => {

    let responseObject;
    try {
        const provider = event.requestContext.identity.cognitoAuthenticationProvider;
        const sub = provider.split(':')[2];

        responseObject = {
            callingUser: sub,
        }

    } catch (error) {

        responseObject = {
            message : "Error. Mist2",
            error: error,
            event : event
        }
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(responseObject)
    }

    callback(null, response);
}