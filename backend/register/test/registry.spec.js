const cryptoFunctions = require("../../modules/src/cryptoFunctions");

const makeRegister = require('../src/registry').makeRegister;

const expect = require('chai').expect;
const assert = require('chai').assert;


it('conversion test', () => {

    const input = "My Unique Asset Id ä😃ää ???";

    const base64Representation = Buffer.from(input).toString('base64');
    const output = Buffer.from(base64Representation, 'base64').toString('utf8');

    expect(input, "not equal").to.be.equal(output);
})

it('[makeRegister] -> result should not be null', () => {
    const register = createMockedRegister();
    expect(register).to.be.not.null;
})

it('[register] -> no input should return an error', async () => {
    const register = createMockedRegister();
    var result = await register(null, "creator");
    expect(result.hasError).to.be.true;
})

it('[register] -> no firstName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "frameNumber", email: "email", lastName: "lastName" }, "creator");
    expect(result.hasError).to.be.true;
})

it('[register] -> no result for api key should return an error', async () => {
    const deps =
        {
            encryptionService: {},
            cryptoFunctions: {},
            transactionRepository: {},
            privateRepository: {},
            apiKeyRepository: {
                get: (bla) => {}
            },
            createUser: {},
            createBlockchainRecord: {},
        }
        
    const register = makeRegister(deps);

    var result = await register({ }, "creator");
    expect(result.message).to.contain("api key not linked");
    expect(result.hasError).to.be.true;
})

it('[register] -> no lastName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "frameNumber", email: "email", firstName: "firstName" }, "creator");
    expect(result.hasError).to.be.true;
})

it('[register] -> should complete full workflow', async () => {

    let saveCalled = false;
    let encryptCalled = false;

    const expectedUserId = "my expected user id";
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
                },
                findByUniqueAssetId: (uniqueAssetId) => { return [] }
            },
            privateRepository: {
                save: (recordToSave) => {
                    expect(recordToSave.userId).to.equal(expectedUserId);
                    expect(recordToSave.encryptedPrivateKey).to.equal(expectedEncryptedPrivateKey);
                    expect(recordToSave.creatorId).to.equal(expectedCreatorId);
                    expect(recordToSave.ethAddress).to.equal(expectedEthAddress);
                    saveCalled = true;
                }
            },
            apiKeyRepository: {
                get: (apiKey) => { return {userId : expectedCreatorId} }
            },
            createUser: () => { return { userId: expectedUserId } },
            createBlockchainRecord: () => { return { status: "pending", date: new Date() } }
        }

    const register = makeRegister(deps);

    var result = await register(input, expectedCreatorId);
    expect(result.hasError, result.message).to.be.undefined;
    expect(saveCalled, "privateRepository.save() was not called").to.be.true;
    expect(encryptCalled, "encryptionSerivce.encyrpt() was not called").to.be.true;
})



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
            privateRepository: {
                save: (user) => "not needed"
            },
            apiKeyRepository: {
                get: (apiKey) => { return {userId : "looney tones"} }
            },
            createUser: () => { return { userId: "myUser" } },
            createBlockchainRecord: () => { return { status: "pending", date: new Date() } }
        }

    const register = makeRegister(deps);
    return register;
}

function createInput() {
    return { uniqueAssetId: "uniqueAssetId", assetType: "bicycle", email: "email", country: "germany", lastName: "lastName", city: "lol", zipcode: "asdas", street: "lol", firstName: "firstName" };
}