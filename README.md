### running locally and deploying the backend
- [Install node.js version 8.1.x](https://nodejs.org/en/download/)
- [Install and run the Azure Functions Core Tools (Version 2.x runtime)](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- Install extension for communicating with azure cosmos db
 
      func extensions install --package Microsoft.Azure.WebJobs.Extensions.CosmosDB --version 3.0.0-beta6

- Run the functions

       run npm install
       func host start

       curl --request POST -H "Content-Type:application/json" --data '{"frameNumber":"sample queue data", "email" : "lol@test.de"}' http://localhost:7071/api/register

the code in the repository relies on a couple of secrets that are not commited and need to be recreated locally.
Add a secrets.js file to the register folder that contains all needed secrets


### Setup of azure cloud:
- [Install azure CLI for macOS](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli-macos?view=azure-cli-latest)
- create function app and all needed resources:

      az group create \
        --name resourceGroupTestKette1 \
        --location westeurope

      az storage account create \
        --name storageaccounttestkette1 \
        --location westeurope \
        --resource-group resourceGroupTestKette1 \
        --sku Standard_LRS

      az functionapp create \
        --name functionAppTestKette1 \
        --resource-group resourceGroupTestKette1 \
        --storage-account storageaccounttestkette1 \
        --consumption-plan-location westeurope

      az cosmosdb create \
        --name privatedatabasetestkette1 \
        --resource-group resourceGroupTestKette1

      az cosmosdb create \
        --name publicdatabasetestkette1 \
        --resource-group resourceGroupTestKette1

      az functionapp config appsettings set \
        --name functionAppTestKette1 \
        --resource-group resourceGroupTestKette1 \
        --settings FUNCTIONS_EXTENSION_VERSION=beta

      az functionapp config appsettings set \
        --name functionAppTestKette1 \
        --resource-group resourceGroupTestKette1 \
        --settings WEBSITE_NODE_DEFAULT_VERSION=8.10.0


#### Publish
    func azure functionapp publish functionAppTestKette1 --publish-local-settings -i --overwrite-settings -y
#### Troubleshooting
- [Deploy to azure fails](https://github.com/Azure/azure-functions-core-tools/issues/352)
- [Install azure CLI fails](https://github.com/Homebrew/homebrew-core/issues/19286)



#### misc. links
- [Azure functions and Azure AD B2C](https://blogs.msdn.microsoft.com/hmahrt/2017/03/07/azure-active-directory-b2c-and-azure-functions/)
- [node.js applications to authenticate to AAD](https://github.com/AzureAD/azure-activedirectory-library-for-nodejs)
- [custom domains for azure functions](https://docs.microsoft.com/en-us/azure/azure-functions/scripts/functions-cli-configure-custom-domain)
- [enable password reset for Azure AD B2C Users](https://docs.microsoft.com/en-us/azure/active-directory-b2c/active-directory-b2c-reference-sspr)
- [getting secrects out of key vaults from inside azure functions](https://medium.com/statuscode/getting-key-vault-secrets-in-azure-functions-37620fd20a0b)
- [Create an Azure Function that connects to an Azure Cosmos DB](https://docs.microsoft.com/en-us/azure/azure-functions/scripts/functions-cli-create-function-app-connect-to-cosmos-db)
