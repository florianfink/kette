/*
*  local test environment needs an endpoint to check if the server is running
*/

"use strict";

module.exports.check = async (event) => {

  let status = 403;
  if(process.env.IS_OFFLINE === 'true'){
    status = 200
  }

  const response = {
      headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true
      },
      statusCode: status,
      body: JSON.stringify({ message : "ok"})
  }

  return response;
}