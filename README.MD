# Development

- npm install
- sls dynamodb install
- npm run start-local-env

# Deployment

Serverless deploy needs to be run twice for the very first deploy. Not ALL creation of resources is automated yet. That´s why the first run creates the initial resource. Then we have to manually create additinal resources and add references in config/secret files. Afterwards we have to run deploy again to deploy the finished serverless.yml with all the correct settings. Additionally creation of identity pools requires the API gateway ID, which is created when deploying for the first time.

- [local] run "serverless deploy"
- [AWS Console - IAM] create encryption key id
- [AWS Console - Cognito] [create user pools for B2C users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create identity pools for B2C users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create user pools for B2B users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] [create identity pools for B2B users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html). Use Gateway Id created on first serverless deploy
- [AWS Console - Cognito] create user with admin access for backend APIs (backend-admin) for end2end-tests
- [local] run "npm run prepare" to copy template files to the correct folders
- [local] update secrets.js
- [local] update serverless-config.json
- [local] update ./_end2endTests/test-secrets.js
- [local] update _end2EndTest/awsConfig with Cognito and API Gateway information
- [local] run "serverless deploy" again with updates in config files

# Misc

#### Setting different stages
- https://github.com/dherault/serverless-offline/issues/338

      provider:
        stage: ${opt:stage, 'dev'}
this will set the self:provider.stage variable either to given --stage parameter value or defaults to dev
