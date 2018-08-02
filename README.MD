# Setup
#### General
Serverless deploy needs to be run twice for the very first deploy. Not ALL creation of resources is automated yet. That´s why the first run creates the initial resource. Then we have to manually create additinal resources and add references in config/secret files. Afterwards we have to run deploy again to deploy the finished serverless.yml with all the correct settings. Additionally creation of identity pools requires the API gateway ID, which is created when deploying for the first time.

- [local] run "serverless deploy"
- [AWS Console - IAM] create encryption key id
- [AWS Console - Cognito] [create user pools for B2C users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create identity pools for B2C users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create user pools for B2B users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create identity pools for B2B users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html). Use Gateway Id created on first serverless deploy
- [local] create secrets.js

        module.exports = {
            stamperySecret : "stampery secret",
            ketteSecret : "kette backend secret"
        }

- [local] create serverless-config.json

      {
          "encryptionKeyId_dev": "(find at AWS Console - IAM)",
          "userPoolId_dev": "(find at AWS Console - Cognito - User pools)",
          "usagePlanId_dev": "(find at AWS Console - API Gateway)",
          "webHookBaseUrl" : "URL that deploy yields as result (find at result of first serverless deploy)"
      }
- [local] create ./_end2endTests/test-secrets.js

      module.exports = {
            awsAccessKeyId : 'backend admin api key',
            awsSecretAccessKey : 'backend admin api Secret',
        }
- [local] update _end2EndTest/awsConfig with Cognito and API Gateway information 
- [local] run "serverless deploy" again with updates in config files

#### AWS IAM
- [end to end test] create user with admin access for backend APIs (backend-admin)

# Development

- npm install
- sls dynamodb install

# Deployment

- serverless deploy
