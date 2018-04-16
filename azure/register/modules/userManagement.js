exports.makeCreateUser = function (acquireToken, fetch) {

    const createUser = async function (user) {

        const token = await acquireToken();
        const bearerToken = token.accessToken;

        const userData = {
            "accountEnabled": true,
            "signInNames": [
                {
                    "type": "emailAddress",
                    "value": user.email
                }
            ],
            "creationType": "LocalAccount",
            "givenName": user.firstName,
            "surName": user.lastName,
            "displayName": user.firstName + " " + user.lastName,
            "passwordProfile": {
                "password": "P@ssword!",
                "forceChangePasswordNextLogin": false
            },
            "passwordPolicies": "DisablePasswordExpiration"
        }

        const header = {
            "Authorization": "bearer " + bearerToken,
            "Content-Type": "application/json"
        }

        const url = "https://graph.windows.net/kettentest1234.onmicrosoft.com/users?api-version=1.6"

        const parameters = {
            method: 'POST',
            body: JSON.stringify(userData),
            headers: header,
        };

        const response = await fetch(url, parameters);
        const result = await response.json();

        const error = result["odata.error"];
        if (error) return { hasError: true, message: error.message.value }
        else return result;
    }

    return createUser;
}
