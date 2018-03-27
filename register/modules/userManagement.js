exports.createUser = async function (user, opts) {

    const token = await opts.acquireToken();
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
        "displayName": "Joe Consumer_",
        "mailNickname": "joec",
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

    const response = await opts.fetch(url, parameters);
    const result = await response.json();

    return result;
}