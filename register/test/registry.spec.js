const makeRegister = require('../src/registry').makeRegister;
const cryptoFunctions = require("../../modules/src/cryptoFunctions");

const convertInput = require('../src/registry').convertInput;
const createTransaction = require('../src/registry').createTransaction;

const expect = require('chai').expect;

describe("registryNew", () => {

    describe("register", () => {

        it('no input should return an error', async () => {
            const register = createMockedRegister();
            var result = await register(null, "creator");
            expect(result.hasError).to.be.true;
        })

        it('no lastName should return an error', async () => {
            const register = createMockedRegister();
            var result = await register({ frameNumber: "frameNumber", email: "email", firstName: "firstName" }, "creator");
            expect(result.hasError).to.be.true;
        })

        it('[makeRegister] -> result should not be null', () => {
            const register = createMockedRegister();
            expect(register).to.be.not.null;
        })

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
                    get: (userId) => { },
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

        it('should create new user record', async () => {

            let saveCalled = false;
            let encryptCalled = false;
            let decryptCalled = false;

            const input = createInput();

            const expectedDateAsString = "2018-05-10T17:06:00.270Z"
            const encryptedPrivateKey = "my encrypted private key";
            const decryptedPrivateKey = "decrypted_Private_Key";
            const privateKeyBuffer = Buffer("this is not a buffer lol");
            const ethAddress = "my eth address";
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
                        expect(privateKey).to.equal(privateKeyBuffer);
                        return expectedSignedMessage;
                    },
                    toPrivateKeyBuffer: (privateKeyString) => {
                        return privateKeyBuffer;
                    }
                },
                transactionRepository: {
                    save: (transaction) => {
                        expect(transaction.signedMessage).to.equal(expectedSignedMessage);
                        expect(transaction.date).to.equal(expectedDateAsString);
                        expect(transaction.ethAddress).to.equal(ethAddress);
                    },
                    findByUniqueAssetId: (uniqueAssetId) => { return [] }
                },
                userRecordRepository: {
                    get: (userId) => {
                        expect(userId).to.equal(input.userId);
                        findCalled = true;
                        return {
                            userId: userId,
                            ethAddress: ethAddress,
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

    it('[Buffer.from] -> conversion test for unique', () => {

        const input = "My Unique Asset Id ä😃ää ???";

        const base64Representation = Buffer.from(input).toString('base64');
        const output = Buffer.from(base64Representation, 'base64').toString('utf8');

        expect(input, "not equal").to.be.equal(output);
    })



    it('[convertInput] -> no firstName should return an error', async () => {
        const input = createInput();
        input.userId = null;
        var result = convertInput(input, "creator");
        expect(result.hasError).to.be.true;
        expect(result.message, result.message).to.contain("userId");
    })



    it('[createTransaction] -> create proper transaction with correct date', async () => {
        const expectedId = "my id that i expecte";
        const date = new Date();
        const registrationData = {
            assetType: "Unicorn",
            uniqueAssetId: "Unicorn Id"
        }

        const blockchainRecord = {
            status: "hungry",
            date: date,
            id: "myBlockchainRecordId"
        }

        const action = "register"
        const ethAddress = "lol bitcoin"
        const signedMessage = "hjihi";

        const transaction = createTransaction(expectedId, registrationData, blockchainRecord, action, ethAddress, signedMessage);

        expect(transaction.id).to.be.equal(expectedId);
        expect(transaction.blockchainRecordId).to.be.equal(blockchainRecord.id);
        expect(transaction.date).to.be.equal(date.toISOString());
    })
})

function createInput() {
    return { uniqueAssetId: "uniqueAssetId", assetType: "bicycle", userId: "thisIsMyUserId" };
}

function createMockedRegister() {
    const deps =
    {
        encryptionService: {
            encrypt: (input) => { return Buffer.from(input).toString('base64'); },
            decrypt: (input) => { return Buffer.from(input, 'base64').toString('utf8') },
        },
        cryptoFunctions: cryptoFunctions,
        transactionRepository: {
            save: () => "not needed",
            find: () => { return [] }
        },
        userRecordRepository: {
            save: (user) => "not needed"
        },
        createBlockchainRecord: () => { return { status: "pending", date: new Date() } }
    }

    const register = makeRegister(deps);
    return register;
}