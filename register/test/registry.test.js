const cryptoFunctions = require("../modules/cryptoFunctions");

const makeRegister = require('../modules/registry').makeRegister;

const expect = require('chai').expect;


it('makeRegister should not be null', () => {
    const deps = 
    {
        cryptoFunctions : cryptoFunctions,
        publicRepository : 1,
        privateRepository : 1,
        createUser : () => "user",
        createBlockchainRecord : () => "record"
    }

    const register = makeRegister(deps);
    expect(register).to.be.not.null;

  })