# Setup
#### AWS Cognito
- [create user pools for B2C users (dev+prod)](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html)
- [create identity pools for B2C users(dev+prod)](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html)
- [create user pools for B2B users(dev+prod)](https://serverless-stack.com/chapters/create-a-cognito-user-pool.html)
- [create identity pools for B2B users(dev+prod)](https://serverless-stack.com/chapters/create-a-cognito-identity-pool.html)
#### AWS IAM
- create aws encryption keys [dev+prod] and add ID to serverless.yml encryptionKeyId_{stage}
- [end to end test] create user with admin access for backend APIs (backend-admin)
- [obsolete] create sercets.js file that contains all necessary secrets
#### AWS API Gateway
- create usage plans [dev+prod] and add id to serverless.yml usagePlanId_{stage} 
# Development
      module.exports = {
            awsAccessKeyId : 'backend admin api key',
            awsSecretAccessKey : 'backend admin api Secret',
            stamperySecret : "stampery secret",
            ketteSecret : "kette backend secret from common key"
        }

- npm install
- sls dynamodb install

#Deployment

- serverless deploy
