const AuthenticationContext = require('adal-node').AuthenticationContext;
const util = require('util');

module.exports = secrets => {
    const authorityUrl = secrets.authorityHostUrl + '/' + secrets.tenant;
    const authContext = new AuthenticationContext(authorityUrl);
    const acquireTokenWithClientCredentialsAsync = util.promisify(authContext.acquireTokenWithClientCredentials.bind(authContext));
    return async () => { 
        return await acquireTokenWithClientCredentialsAsync(secrets.resource, secrets.applicationId, secrets.clientSecret); 
    }
}
