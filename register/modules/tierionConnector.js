"use strict";

exports.options = function(fetch, secrets){
  this.secrets = secrets;
  this.fetch = fetch;
}

exports.registerBike = async function (registerData) {
  if(!this.secrets || !this.fetch) throw "fetch or secrets not set";

  const header =  {
    "X-Username": this.secrets.email,
    "X-Api-Key": this.secrets.apikey,
    "Content-Type": "application/json"
  }

  const url = "https://api.tierion.com/v1/records"

  const parameters = {
    method: 'POST',
    body: registerData,
    headers: header,
  };

  const registerBikeResponse = await this.fetch(url, parameters);
  const registerBikeResult = await registerBikeResponse.json();
  return registerBikeResult;
}


exports.createRegisterRequestData = function (dataStoreId, frameNumber, publicKey, message) {
  const registerRequestData = JSON.stringify({
    datastoreId: dataStoreId,
    frameId: frameNumber,
    publicKey: publicKey,
    message: message
  });

  return registerRequestData;
}
/*
  var registerRequestData = 
  {
    frameNumber: "1337",
    address : "0x04e491ae062d0a4c5e2b5b7cbc33b73f0e3bf3c5",
    cosigningaddress: "0x6d6db169514a4d8ba644f2039c119fce75000438",
    action : "register",
    signedMessage : {
        address : "0x04e491ae062d0a4c5e2b5b7cbc33b73f0e3bf3c5",
        message : "I hereby register bike with framenumber 1337",
        signature : "0xfe6dbc93820721ff3233a58be52c8207edd4f943a49f69d2da1004c9cef67bf052296c05d465c5e9df0b6d6f60ac767ddb0b5e6fe650da296bbc02cd534dfa001b",
    },
    cosignedMessage : {
        address : "0x6d6db169514a4d8ba644f2039c119fce75000438",
        msg : "I hereby cosign message with signature 0xfe6dbc93820721ff3233a58be52c8207edd4f943a49f69d2da1004c9cef67bf052296c05d465c5e9df0b6d6f60ac767ddb0b5e6fe650da296bbc02cd534dfa001b",
        sig : "0x80974c4d60f57ffeb1dfc04ec2065436df8cd98f7cf621703ee4b5d70802f1b370f063bb76ebe1eddd4371679b8364c5a309c26c6df5ff3d45004940c01f372e1c",
    }
  }

  
}
*/
