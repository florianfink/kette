# KETTE Asset registry backend

This repository contains the backend for the KETTE registry. The backend is responsible for providing an API for charging a credit card and registrering assets on behalf of a user by minting a ERC721 compliant token in the [KETTE registry smart contract](https://github.com/kette-io/nft-asset-registry-dapp).

## Requirements

##### AWS Lambda
The backend is using [AWS Lambda](https://aws.amazon.com/lambda/) and requires a AWS account as well as the [AWS CLI](https://aws.amazon.com/cli/)

##### Stripe
For charging credit cards we use [Stripe](https://stripe.com/). A Stripe account is necessary to interact with the stripe API.

## Run
        npm install
        sls dynamodb install
        npm run start-local-env

## API Documentation

[Swagger description](https://kette-io.github.io/nft-asset-registry-backend-documentation/)

## Architecture Overview

The project comprises of four modules. Each module with its individual repository:

- [fiat frontend](https://github.com/kette-io/nft-asset-registry-fiat-frontend)
- [dApp](https://github.com/kette-io/nft-asset-registry-dapp)
- backend (this repository)
- [smart contracts](https://github.com/kette-io/nft-asset-registry-smart-contracts)

![Architecture Overview](https://github.com/kette-io/nft-asset-registry-fiat-frontend/raw/master/readMeImages/architectureOverview.jpg)

## Deployment

Serverless deploy needs to be run twice for the very first deploy. Not ALL creation of resources is automated yet. That´s why the first run creates the initial resource. Then we have to manually create additinal resources and add references in config/secret files. Afterwards we have to run deploy again to deploy the finished serverless.yml with all the correct settings. Additionally creation of identity pools requires the API gateway ID, which is created when deploying for the first time.

- [local] run "serverless deploy"
- [AWS Console - IAM] create encryption key id
- [AWS Console - Cognito] create user with admin access for backend APIs (backend-admin) for end2end-tests
- [local] run "npm run prepare" to copy template files to the correct folders
- [local] update .env
- [local] update ./_end2endTests/test-secrets.js
- [local] update _end2EndTest/awsConfig with Cognito and API Gateway information

- [local] run "serverless deploy" again with updates in config files

## Misc

#### Setting different stages
- https://github.com/dherault/serverless-offline/issues/338

      provider:
        stage: ${opt:stage, 'dev'}
this will set the self:provider.stage variable either to given --stage parameter value or defaults to dev

## Todo
- automated tests
- error handling
- data validation
