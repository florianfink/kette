
const AWS = require('aws-sdk');

module.exports = (secrets, config) => {
    functions = {
        encrypt: async (textToEncrypt) => {
            AWS.config.update({ region: config.awsRegion });
            AWS.config.update({ accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });

            var kms = new AWS.KMS();
            var params = {
                KeyId: config.awsCmkId, 
                Plaintext: textToEncrypt
            };

            let result;
            try {
                const encrpyted = await kms.encrypt(params).promise();
                result = encrpyted.CiphertextBlob.toString('base64');
            } catch (err) {
                result = err;
            }
            return result;
        },

        decrypt: async (dataToDecrypt) => {
            AWS.config.update({ region: config.awsRegion });
            AWS.config.update({ accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });

            var kms = new AWS.KMS();
            var params = {
                CiphertextBlob: Buffer(dataToDecrypt, 'base64')
            };

            let result;
            try {
                const decrpyted = await kms.decrypt(params).promise();
                result = decrpyted.Plaintext.toString('ascii');
            } catch (err) {
                result = err;
            }
            return result;
        }
    }

    return functions;
}
