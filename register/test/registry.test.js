const cryptoFunctions = require("../modules/cryptoFunctions");

const makeRegister = require('../modules/registry').makeRegister;

const expect = require('chai').expect;

 
it('happy path. all working', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "123", email: "asd", lastName: "saasd", firstName : "asd" });
    expect(result.hasError).to.be.undefined;
})

it('makeRegister should not be null', () => {
    const register = createMockedRegister();
})

it('no input should return an error', async () => {
    const register = createMockedRegister();
    var result = await register();
    expect(result.hasError).to.be.true;
})

it('no firstName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "123", email: "asd", lastName: "saasd" });
    expect(result.hasError).to.be.true;
})

it('no lastName should return an error', async () => {
    const register = createMockedRegister();
    var result = await register({ frameNumber: "123", email: "asd", firstName: "saasd" });
    expect(result.hasError).to.be.true;
})



function createMockedRegister() {
    const deps =
        {
            cryptoFunctions: cryptoFunctions,
            publicRepository: 1,
            privateRepository: 1,
            createUser: () => "user",
            createBlockchainRecord: () => "record"
        }

    const register = makeRegister(deps);
    expect(register).to.be.not.null;
    return register;
}