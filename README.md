### running locally and deploying the backend
- [Install node.js version 8.1.x](https://nodejs.org/en/download/)
- [Install and run the Azure Functions Core Tools (Version 2.x runtime)](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)


       run npm install
       func host start

       curl --request POST -H "Content-Type:application/json" --data '{"frameNumber":"sample queue data"}' http://localhost:7071/api/register

the code in the repository relies on a couple of secrets that are not commited and need to be recreated locally.
Add a secrets.js file the register folder with the following contents

- exports.email = "tierion E-Mail";
- exports.apikey = "tierion api key";
- exports.dataStoreId = tierionDataStoreId;


### Setup of azure cloud:
- [Install azure CLI for macOS](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-macos?view=azure-cli-latest)
- [Create an Azure Function that connects to an Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/azure-functions/scripts/functions-cli-create-function-app-connect-to-cosmos-db)
- Set functionApp settings version and node version to properly work with code in this repository

      az functionapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings FUNCTIONS_EXTENSION_VERSION=beta
      az functionapp config appsettings set --name <app-name> --resource-group <resource-group-name> --settings WEBSITE_NODE_DEFAULT_VERSION=8.9.4

#### Troubleshooting
- [Install azure CLI fails](https://github.com/Homebrew/homebrew-core/issues/19286)


#### misc. links
- [Azure functions and Azure AD B2C](https://blogs.msdn.microsoft.com/hmahrt/2017/03/07/azure-active-directory-b2c-and-azure-functions/)
- [node.js applications to authenticate to AAD](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs)
- [custom domains for azure functions](https://docs.microsoft.com/en-us/azure/azure-functions/scripts/functions-cli-configure-custom-domain)
- [enable password reset for Azure AD B2C Users](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-sspr)
- [getting secrects out of key vaults from inside azure functions](https://medium.com/statuscode/getting-key-vault-secrets-in-azure-functions-37620fd20a0b)
