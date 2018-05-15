# Setup
#### AWS Cognito
- [create user pool for B2C users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html)
- [create identity pool for B2C users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html)
- [create user pool for B2B users](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html)
- [create identity pool for B2B users](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html)
#### AWS IAM
- create user with admin access for backend APIs (backend-admin)
- create AWS central master key and add backend-admin as "Key User"
- create sercets.js file that contains all necessary secrets
# Development
      module.exports = {
            awsAccessKeyId : 'backend admin api key',
            awsSecretAccessKey : 'backend admin api Secret',
            awsUsagePlanId : "usage plan id from aws console",
            stamperySecret : "stampery secret",
            ketteSecret : "kette backend secret from common key"
        }

- npm install
- sls dynamodb install

#Deployment

- serverless deploy
