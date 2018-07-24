# KETTE API
Description of a RESTful API for registering assets on the blockchain via KETTE.

## General
KETTE uses REST methodology for its APIs. All data included in requests to API methods must be JSON formatted. Additionally, you will have to provide your private API key with every request.
Every Data API request must contain the following headers:

      x-functions-key: <your-api-key>

## Endpoints

- [Register](#Register)
- [Get Users](#Get-Users)

------
### Register

Creates a record of the asset in the KETTE backend and a proof on the blockchain. Additionally, a user account and a private key are created. 

[POST] https://api.kette.io/v1/register

Content-Type: “application/json”

#### Parameters

| Name                    | Description      
| -------------           |-------------   |
| uniqueAssetId           | e.g. frame number of a bicycle’ |
| assetType                    | Only supported value at the moment: ‘bicycle’      |
| name                    | Last name of the person registering the asset      |
| firstName                    | First name of the person registering the asset      |
| street                    | Address: Street name      |
| zipCode                    | Address: Zip Code     |
| city                    | Address: City      |
| country                    | Address: Country      |
| eMail                    | E-Mail address of the person registering the asset      |

#### Sample Request
      {
          "uniqueAssetId": "MyFrameNumber",
          "assetType": "bicycle",
          "name": "Hans",
          "lastName": "Müller",
          "street": "Lange Straße 24",
          "zipCode": "70166",
          "city": "Stuttgart",
          "country": "Germany"
          "eMail": "Hans.Mueller@t-online.de"
      }

#### Sample Response
      { 
        id: 'ed5c8e10-8741-11e8-b848-c1fdfa6344f7',
        assetType: 'bicycle',
        uniqueAssetId: 'MyFrameNumber',
        action: 'register',
        ethAddress: '0x9dd19bea879101e5105019f87b6bde6ece817c63',
        blockchainRecordId: '5b49b79a9194f30004b2c1c8',
        status: 'pending',
        date: '2018-07-14T08:43:06.205Z',
        signedMessage:
         { address: '0x9dd19bea879101e5105019f87b6bde6ece817c63',
           msg: '
           {
               "action":"register",
               "assetType":"bicycle",
               "uniqueAssetId":"MyFrameNumber" 
           }',
           sig: '0x489d5da82008c43db5f2dcb0b90c64697a71d6e87fbdeb952f8233459dd2ef30710026a294aa044873c6c5ec126e7b1a63e67fcc8df0f0001a60088d2fb8580b1b',
           version: '2' 
          } 
      }
------
### Get-Users
This method returns all users created with the api key provided in the header of the request.

[GET] https://api.kette.io/v1/users/

Sample response:

      [
          {
              "Username": "6bcc8df6-5d45-4066-8c3b-5b94d5feca0f",
              "UserAttributes": [
                  {
                      "Name": "sub",
                      "Value": "6bcc8df6-5d45-4066-8c3b-5b94d5feca0f"
                  },
                  {
                      "Name": "address",
                      "Value": "Lange Straße 24 Stuttgart Germany"
                  },
                  {
                      "Name": "email_verified",
                      "Value": "true"
                  },
                  {
                      "Name": "name",
                      "Value": "Hans Müller"
                  },
                  {
                      "Name": "given_name",
                      "Value": "Hans"
                  },
                  {
                      "Name": "family_name",
                      "Value": "Müller"
                  },
                  {
                      "Name": "email",
                      "Value": "Hans.Mueller@t-online.de"
                  }
              ],
              "UserCreateDate": "2018-06-09T08:37:47.042Z",
              "UserLastModifiedDate": "2018-06-09T08:37:47.042Z",
              "Enabled": true,
              "UserStatus": "FORCE_CHANGE_PASSWORD"
          }
      ]

