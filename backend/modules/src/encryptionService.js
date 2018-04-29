
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

            const encrpyted = await kms.encrypt(params).promise();
            const result = encrpyted.CiphertextBlob.toString('base64');

            return result;
        },

        decrypt: async (dataToDecrypt) => {
            AWS.config.update({ region: config.awsRegion });
            AWS.config.update({ accessKeyId: secrets.awsAccessKeyId, secretAccessKey: secrets.awsSecretAccessKey });

            var kms = new AWS.KMS();
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
