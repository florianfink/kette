"use strict";

exports.makeCreateBlockchainRecord = function (secrets, fetch) {

  const createBlockchainRecord = async function (record) {

    const header = {
      "X-Username": secrets.email,
      "X-Api-Key": secrets.apikey,
      "Content-Type": "application/json"
    }

    const recordData = exports.createRecordCreationRequestData(secrets.dataStoreId, record);

    const url = "https://api.tierion.com/v1/records"

    const parameters = {
      method: 'POST',
      body: recordData,
      headers: header,
    };

    const registerBikeResponse = await fetch(url, parameters);
    const registerBikeResult = await registerBikeResponse.json();

    return registerBikeResult;
  }

  return createBlockchainRecord;
}

exports.createRecordCreationRequestData = function (dataStoreId, message) {
  const registerRequestData = JSON.stringify({
    datastoreId: dataStoreId,
    message: message
  });

  return registerRequestData;
}