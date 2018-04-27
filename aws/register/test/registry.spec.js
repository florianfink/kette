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

it('makeRegister should not be null', () => {
    const register = createMockedRegister();
    expect(register).to.be.not.null;
})

it('happy path. all working', async () => {
    const register = createMockedRegister();
    const input = createInput();
    var result = await register(input, "creator");
    expect(result.hasError, result.message).to.be.undefined;
})

it('no input should return an error', async () => {
    const register = createMockedRegister();
    var result = await register(null, "creator");
    expect(result.hasError).to.be.true;
})

it('no firstName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "frameNumber", email: "email", lastName: "lastName" }, "creator");
    expect(result.hasError).to.be.true;
})

it('no lastName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "frameNumber", email: "email", firstName: "firstName" }, "creator");
    expect(result.hasError).to.be.true;
})

it('should save with created user and encrypted private key', async () => {

    let saveCalled = false;
    let encryptCalled = false;

    const expectedUserId = "my expected user id";
    const expectedPrivateKey = "my private key";
    const expectedEncryptedPrivateKey = "my encrypted private key";
    const expectedAssets = [{ id: "my watch id" }];
    const input = createInput();
    const expectedCreatorId = "looney toones";

    const cryptoFunctionsLocal = require("../../modules/src/cryptoFunctions");

    cryptoFunctionsLocal.generateNewKey = () => { return { privateKeyString: expectedPrivateKey } }
    cryptoFunctionsLocal.sign = () => "not needed";

    const deps =
        {
            encryptionService: {
                encrypt: (dataToEncrypt) => {
                    expect(dataToEncrypt).to.equal(expectedPrivateKey);
                    encryptCalled = true;
                    return expectedEncryptedPrivateKey;
                }
            },
            cryptoFunctions: cryptoFunctionsLocal,
            publicRepository: {
                save: () => "not needed",
                find: () => { return [] }
            },
            privateRepository: {
                save: (recordToSave) => {
                    expect(recordToSave.userId).to.equal(expectedUserId);
                    expect(recordToSave.encryptedPrivateKey).to.equal(expectedEncryptedPrivateKey);
                    expect(recordToSave.creatorId).to.equal(expectedCreatorId);
                    expect(recordToSave.assets[0].uniqueAssetId).to.equal(input.uniqueAssetIdentifier);
                    saveCalled = true;
                }
            },
            createUser: () => { return { userId: expectedUserId, privateKey: expectedPrivateKey, assets: expectedAssets } },
            createBlockchainRecord: () => "not needed"
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
            publicRepository: {
                save: () => "not needed",
                find: () => { return [] }
            },
            privateRepository: {
                save: (user) => "not needed"
            },
            createUser: () => "user",
            createBlockchainRecord: () => "record"
        }

    const register = makeRegister(deps);
    return register;
}

function createInput() {
    return { uniqueAssetIdentifier: "uniqueAssetIdentifier", assetType: "bicycle", email: "email", country: "germany", lastName: "lastName", city: "lol", zipcode: "asdas", street: "lol", firstName: "firstName" };
}