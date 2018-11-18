# KETTE API
Description of a RESTful API for registering bicycles on the ethereum blockchain via KETTE.

## General
KETTE uses REST methodology for its API. All data included in requests to API methods must be JSON formatted. Additionally, you will have to provide your private API key with every request.
Every Data API request must contain the following headers:

      x-functions-key: <your-api-key>

## Endpoints

- [RegisterFor](#Register)
- [BikesFor](#Get-Bikes-For)

------
### Register

Creates a record of the bicycle in the KETTE smart contract by minting an ERC-721 compliant token on the ethereum blockchain. Additionally, an ethereum account for the given user id is created. Returns the transaction hash.

[POST] https://{comingSoon}/v1/registerFor

Content-Type: “application/json”

#### Parameters

| Name                    | Description      
| -------------           |-------------   |
| vendor                  | vendor of the bicycle. e.g. Babboe or Hercules |
| serialNumber            | serialnumber of the bicycle |
| frameNumber             | frameNumber of the bicycle |
| ipfsImageHash           | the multihash of the image that was uploaded to [ipfs](https://ipfs.io/)|
| userId                  | the ID that represents the user in your system |

#### Sample Request
      {
        "vendor" : "Hercules",
        "serialNumber" : "SN1234567",
        "frameNumber" : "FN98765123",
        "ipfsHash" : "QmTPm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkcrJK4ej",
        "userId" : "userAliceInMySystem",
      }

#### Sample Response
      { 
        hash: '0xff54aaf2dcf63ad4cd923491167dca03cc6064afbb183420d5776a729b812154',
      }
------
### Get-Bikes-For

Returns all bicycles that are registered for a given user id. Will only return a valid result if the user is properly linked to the provided API-key.

[GET] https://{comingSoon}/v1/bikesFor/{id}

Sample response:

      [ 
       {  
          vendor: 'Babboe',
          serialNumber: 'SN123456',
          frameNumber: '98875FN',
          ipfsImageHash: 'QmTPm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkcrJK4ej',
          state: 'ok',
          uniqueId: '40350603363987371717651935907820542153089294464868663262461173759060179152134' 
       },
       { 
          vendor: 'Hercules',
          serialNumber: '98765SN',
          frameNumber: 'FN123456',
          ipfsImageHash: 'QmLFm34ejpjdmbZYaJE8uMTbfTCs8EkzrJKFzUKs7iptDM',
          state: 'ok',
          uniqueId: '63987371717654035060331935907889294464868606017915213463262461120542153073759' 
       }
      ]