# KETTE API
Description of a RESTful API for registering bicycles on the ethereum blockchain via KETTE.

## General
KETTE uses REST methodology for its API. All data included in requests to API methods must be JSON formatted. 

## Endpoints

- [Register a bicycle](#Register)
- [Get all bicycles registerd to an account](#Get-Bikes)
- [Lookup a bicycle](#Lookup-Bicycle)
- [Get price](#Get-Price)

------
### Register

Creates a record of the bicycle in the KETTE smart contract by minting an ERC-721 compliant token on the ethereum blockchain. Charges a credit card with the current [price](#Get-Price) in cents. Returns a transaction hash.

[POST] https://{comingSoon}/v1/register

Content-Type: “application/json”

#### Parameters

| Name                    | Description      
| -------------           |-------------   
| vendor                  | vendor of the bicycle. e.g. Babboe or Hercules 
| serialNumber            | serialnumber of the bicycle 
| frameNumber             | frameNumber of the bicycle 
| ipfsImageHash           | the multihash of the image that was uploaded to [ipfs](https://ipfs.io/)
| bikeOwnerAccount        | ethereum address to which the bike should be registered
| stripeToken             | a valid stripe token obtained from the [Stripe API](https://stripe.com/docs/api)
| ketteSecret             | a temporary secret to prevent unrestricted access during beta-phase.

#### Sample Request
      {
        "vendor" : "Hercules",
        "serialNumber" : "SN1234567",
        "frameNumber" : "FN98765123",
        "ipfsHash" : "QmTPm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkcrJK4ej",
        "bikeOwnerAccount" : "0x5ae6A13cF333d8847DC2f8224E4ED700429fEe38",
        "stripeToken": "tok_visa",
        "ketteSecret" : "IamAVerySecretPassword"
      }

#### Sample Response
      { 
        hash: '0xff54aaf2dcf63ad4cd923491167dca03cc6064afbb183420d5776a729b812154'
      }
------
### Get-Bikes

Returns all bicycles that are registered to a given ethereum address.

#### Parameters

| Name                    | Description      
| -------------           |-------------   
| ethAddress              | owner of the bicycles to get.

[GET] https://{comingSoon}/v1/bikes/{ethAddress}

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
------
### Lookup-Bicycle

Returns all bicycle information if a match is found. Note that this lookup only works for EXACT matches (case sensitive).

#### Parameters

| Name                    | Description      
| -------------           |-------------  
| vendor                  | vendor of the bicycle. e.g. Babboe or Hercules 
| serialNumber            | serialnumber of the bicycle 
| frameNumber             | frameNumber of the bicycle 

[GET] https://{comingSoon}/v1/bike?vendor=Babboe&serialNumber=SN123456&frameNumber=98875FN

Sample response:

      {  
          vendor: 'Babboe',
          serialNumber: 'SN123456',
          frameNumber: '98875FN',
          ipfsImageHash: 'QmTPm3dmbpjFzUKs7iptDMZYaJE8uMTbfTCs8EkcrJK4ej',
          state: 'ok',
          uniqueId: '40350603363987371717651935907820542153089294464868663262461173759060179152134' 
      }
------
### Get-Price

Returns the current price in € (Euro) that is charged for a bicycle registration. [See register](#Register)

[GET] https://{comingSoon}/v1/price

Sample response:

      { 
        priceInEuro: 0.7188148,
        priceInCents: 72 
      }