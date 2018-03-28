const AuthenticationContext = require('adal-node').AuthenticationContext;
const util = require('util');

module.exports = function (secrets) {
    const authorityUrl = secrets.authorityHostUrl + '/' + secrets.tenant;
    const authContext = new AuthenticationContext(authorityUrl);
    const acquireTokenWithClientCredentialsAsync = util.promisify(authContext.acquireTokenWithClientCredentials.bind(authContext));

    const acquireToken = async function () {
        return await acquireTokenWithClientCredentialsAsync(secrets.resource, secrets.applicationId, secrets.clientSecret);
    }

    return acquireToken;
}
