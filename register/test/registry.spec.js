const makeRegister = require('../src/registry').makeRegister;
const cryptoFunctions = require("../../modules/src/cryptoFunctions");

const convertInput = require('../src/registry').convertInput;
const createTransaction = require('../src/registry').createTransaction;

const expect = require('chai').expect;

describe("registry", () => {

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

        it('should return error because key pair not found', async () => {
            const input = createInput();
            
            const deps =
            {
                encryptionService: {},
                cryptoFunctions: {},
                transactionRepository: {},
                userRecordRepository: {
                    get: (userId) => { },
                },
                apiKeyRepository: {},
                createBlockchainRecord: () => { }
            }

            const register = makeRegister(deps);
            var result = await register(input);
            expect(result, "error expected but did not occur").not.to.be.undefined;
        })

        it('should complete the registration without error', async () => {

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
                createBlockchainRecord: () => { return { status: "pending", date: new Date(expectedDateAsString) } }
            }

            const register = makeRegister(deps);

            var result = await register(input);
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

        const transaction = createTransaction(registrationData.uniqueAssetId, registrationData.assetType, blockchainRecord, action, ethAddress, signedMessage);

        expect(transaction.uniqueAssetId).to.be.equal(registrationData.uniqueAssetId);
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