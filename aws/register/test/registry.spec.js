const cryptoFunctions = require("../src/cryptoFunctions");

const makeRegister = require('../src/registry').makeRegister;

const expect = require('chai').expect;



it('makeRegister should not be null', () => {
    const register = createMockedRegister();
    expect(register).to.be.not.null;
})

it('happy path. all working', async () => {
    const register = createMockedRegister();
    const input = createInput();
    var result = await register(input);
    expect(result.hasError, result.message).to.be.undefined;
})

it('no input should return an error', async () => {
    const register = createMockedRegister();
    var result = await register();
    expect(result.hasError).to.be.true;
})

it('no firstName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "frameNumber", email: "email", lastName: "lastName" });
    expect(result.hasError).to.be.true;
})

it('no lastName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "frameNumber", email: "email", firstName: "firstName" });
    expect(result.hasError).to.be.true;
})

it('should save with created user and private key', async () => {

    var saveCalled = false;
    const expectedUserId = "my expected user id";
    const expectedPrivateKey = "my expected private key";

    const cryptoFunctionsLocal = require("../src/cryptoFunctions");

    cryptoFunctionsLocal.generateNewKey = () => { return { privateKeyString: expectedPrivateKey } }
    cryptoFunctionsLocal.sign = () => "not needed";

    const deps =
        {
            cryptoFunctions: cryptoFunctionsLocal,
            publicRepository: { 
                save: () => "not needed",
                find: () => {return []} },
            privateRepository: {
                save: (input) => {
                    expect(input.userId).to.equal(expectedUserId);
                    expect(input.privateKey).to.equal(expectedPrivateKey);
                    saveCalled = true;
                }
            },
            createUser: () => { return { userId: expectedUserId, privateKey: expectedPrivateKey } },
            createBlockchainRecord: () => "not needed"
        }

    const register = makeRegister(deps);
    const input = createInput();
    var result = await register(input);
    expect(result.hasError, result.message).to.be.undefined;
    expect(saveCalled, "privateRepository.save() was not called").to.be.true;
})



function createMockedRegister() {
    const deps =
        {
            cryptoFunctions: cryptoFunctions,
            publicRepository: { 
                save: () => "not needed",
                find: () => {return []} },
            privateRepository: { 
                save: (user) => "not needed"},
            createUser: () => "user",
            createBlockchainRecord: () => "record"
        }

    const register = makeRegister(deps);
    return register;
}

function createInput() {
    return { uniqueAssetIdentifier: "uniqueAssetIdentifier", assetType: "bicycle", email: "email", country: "germany", lastName: "lastName", city: "lol", zipcode : "asdas", street : "lol", firstName: "firstName" };
}