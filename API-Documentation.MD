# KETTE API
Description of a RESTful API for registering bicycles on the blockchain via KETTE.

## General
KETTE uses REST methodology for its API. All data included in requests to API methods must be JSON formatted. Additionally, you will have to provide your private API key with every request.
Every Data API request must contain the following headers:

      x-functions-key: <your-api-key>

## Endpoints

- [RegisterFor](#Register)
- [GetBikesFor](#Get-Users)

------
### Register

Creates a record of the bicycle in the KETTE smart contract by miniting a ERC-721 compliant token on the blockchain. Additionally, an ethereum account for the given user id is created. Returns the transaction hash.

[POST] https://api.kette.io/v1/registerFor

Content-Type: “application/json”

#### Parameters

| Name                    | Description      
| -------------           |-------------   |
| uniqueId                | e.g. frame number of the bicycle |
| ipfsHash                | the hash of the image that was uploaded to [ipfs](https://ipfs.io/)|
| description             | e.g. 'red mountain bike' Max. 50 characters |
| userId                  | the ID that represents the user in your system |

#### Sample Request
      {
        "uniqueId" : "FRNR123456",
        "ipfsHash" : "QmTPm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkcrJK4ej",
        "description" : "Blue Mountain Bike",
        "userId" : "user123InMySystem",
      }

#### Sample Response
      { 
        hash: '0xff54aaf2dcf63ad4cd923491167dca03cc6064afbb183420d5776a729b812154',
      }
------
### Get-Bikes-For
Returns all bicycles that are registered for a given user id.

[GET] https://api.kette.io/v1/bikesFor/{id}

Sample response:

      [
        {
         "uniqueId":"FRNR123456",
         "ipfsHash":"QmTPm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkcrJK4ej",
         "description":"green mountain bike",
        },
        {
          "uniqueId":"FRNRZZ987",
          "ipfsHash":"QmLFm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkzrJK4ej",
          "description":"red city bike"
        }
      ]

