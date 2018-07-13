# Setup
#### General
Serverless deploy needs to be run twice for the very first deploy. Not ALL creation of resources is automated yet. That´s why the first run creates the initial resource. Then we have to manually create additinal resources and add references in the serverless.yml. Afterwards we have to run deploy again to deploy the finished serverless.yml with all the correct settings. Additionally creation of identity pools requires the API gateway ID, which is created when deploying for the first time.

- [local] run "serverless deploy"
- [AWS Console - IAM] create encryption key id
- [AWS Console - Cognito] [create user pools for B2C users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create identity pools for B2C users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create user pools for B2B users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create identity pools for B2B users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html). Use Gateway Id created on first serverless deploy
- [local] add usage plan id to serverless.yml (find at AWS Console - API Gateway)
- [local] add encryption key to serverless.yml (find at AWS Console - IAM)
- [local] update webHookBaseUrl with URL that deploy yields as result (find at result of first serverless deploy)
- [local] add b2c user pool Id to serverless.yml (find at AWS Console - Cognito - User pools)
- [local] update _end2EndTest/awsConfig with Cognito and API Gateway information 
- [local] run "serverless deploy" again with updated serverless.yml

#### AWS IAM
- [end to end test] create user with admin access for backend APIs (backend-admin)
- [obsolete] create sercets.js file that contains all necessary secrets

# Development
      
      module.exports = {
            awsAccessKeyId : 'backend admin api key',
            awsSecretAccessKey : 'backend admin api Secret',
        }

        module.exports = {
            stamperySecret : "stampery secret",
            ketteSecret : "kette backend secret from common key"
        }

- npm install
- sls dynamodb install

#Deployment

- serverless deploy
