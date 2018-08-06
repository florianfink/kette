const makeRegister = require('../src/registry_externaluser').makeRegister;

const expect = require('chai').expect;

describe("registry_externaluser", () => {
    describe("existing user", () => {
        it('should use existing user', async () => {

            let saveCalled = false;
            let encryptCalled = false;

            const expectedDateAsString = "2018-05-10T17:06:00.270Z"
            const expectedPrivateKey = "my private key";
            const expectedEncryptedPrivateKey = "my encrypted private key";
            const input = createInput();
            const expectedEthAddress = "my eth address";
            const expectedSignedMessage = "my signed Message";
            const expectedCreatorId = "my expected creator id";
            const deps =
            {
                encryptionService: {
                    encrypt: (dataToEncrypt) => {
                        expect(dataToEncrypt).to.equal(expectedPrivateKey);
                        encryptCalled = true;
                        return expectedEncryptedPrivateKey;
                    }
                },
                cryptoFunctions: {
                    generateNewKey: () => {
                        return { privateKeyString: expectedPrivateKey, ethAddress: expectedEthAddress }
                    },
                    sign: () => {
                        return expectedSignedMessage
                    }
                },
                transactionRepository: {
                    save: (transaction) => {
                        expect(transaction.signedMessage).to.equal(expectedSignedMessage);
                        expect(transaction.date).to.equal(expectedDateAsString);
                        expect(transaction.ethAddress).to.equal(expectedEthAddress);
                    },
                    findByUniqueAssetId: (uniqueAssetId) => { return [] }
                },
                userRecordRepository: {
                    save: (recordToSave) => {
                        expect(recordToSave.userId).to.equal(input.userId);
                        expect(recordToSave.encryptedPrivateKey).to.equal(expectedEncryptedPrivateKey);
                        expect(recordToSave.creatorId).to.equal(expectedCreatorId);
                        expect(recordToSave.ethAddress).to.equal(expectedEthAddress);
                        saveCalled = true;
                    }
                },
                apiKeyRepository: {
                    get: (apiKey) => { return { userId: expectedCreatorId } }
                },
                createBlockchainRecord: () => { return { status: "pending", date: new Date(expectedDateAsString) } }
            }

            const register = makeRegister(deps);

            var result = await register(input, expectedCreatorId);
            expect(result.hasError, "ERROR: " + result.message).to.be.undefined;
            expect(saveCalled, "privateRepository.save() was not called").to.be.true;
            expect(encryptCalled, "encryptionSerivce.encyrpt() was not called").to.be.true;
        })
    })
    describe("new user", () => {
        it('should create new user', async () => {

            let saveCalled = false;
            let encryptCalled = false;
            let decryptCalled = false;

            const input = createInput();

            const expectedDateAsString = "2018-05-10T17:06:00.270Z"
            const encryptedPrivateKey = "my encrypted private key";
            const decryptedPrivateKey = "decrypted_Private_Key";
            const expectedEthAddress = "my eth address";
            const expectedSignedMessage = "my signed Message";
            const expectedCreatorId = "my expected creator id";

            const deps =
            {
                encryptionService: {
                    decrypt: (dataToDecrypt) => {
                        expect(dataToDecrypt).to.equal(encryptedPrivateKey);
                        decryptCalled = true;
                        return decryptedPrivateKey;
                    }
                },
                cryptoFunctions: {
                    sign: (message, privateKey) => {
                        expect(privateKey).to.equal(decryptedPrivateKey);
                        return expectedSignedMessage;
                    }
                },
                transactionRepository: {
                    save: (transaction) => {
                        expect(transaction.signedMessage).to.equal(expectedSignedMessage);
                        expect(transaction.date).to.equal(expectedDateAsString);
                        expect(transaction.ethAddress).to.equal(expectedEthAddress);
                    },
                    findByUniqueAssetId: (uniqueAssetId) => { return [] }
                },
                userRecordRepository: {
                    find: (userId) => {
                        expect(userId).to.equal(input.userId);
                        findCalled = true;
                        return {
                            userId: userId,
                            ethAddress: "ethAddress",
                            encryptedPrivateKey: encryptedPrivateKey,
                            creatorId: "creatorId",
                        }
                    }
                },
                apiKeyRepository: {
                    get: (apiKey) => { return { userId: expectedCreatorId } }
                },
                createBlockchainRecord: () => { return { status: "pending", date: new Date(expectedDateAsString) } }
            }

            const register = makeRegister(deps);

            var result = await register(input, expectedCreatorId);
            expect(result.hasError, result.message).to.be.undefined;
            expect(saveCalled, "user record is not supposed to be saved").to.be.false;
            expect(encryptCalled, "encrypt is not supposed to be called").to.be.false;
            expect(decryptCalled, "decrypt was not called. HOW DO YOU SIGN NOW?").to.be.true;
        })
    })
})

function createInput() {
    return { uniqueAssetId: "uniqueAssetId", assetType: "bicycle", userId: "thisIsMyUserId" };
}