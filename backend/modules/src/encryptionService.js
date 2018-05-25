
const AWS = require('aws-sdk');

module.exports = (kms) => {

    functions = {
        encrypt: async (textToEncrypt) => {

            var params = {
                KeyId : process.env.ENCRYPTION_KEYID,
                Plaintext: textToEncrypt
            };

            const encrpyted = await kms.encrypt(params).promise();
            const result = encrpyted.CiphertextBlob.toString('base64');

            return result;
        },

        decrypt: async (dataToDecrypt) => {

            var params = {
                CiphertextBlob: Buffer(dataToDecrypt, 'base64')
            };

            const decrpyted = await kms.decrypt(params).promise();
            const result = decrpyted.Plaintext.toString('ascii');
            
            return result;
        }
    }

    return functions;
}
