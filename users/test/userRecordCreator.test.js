const makeCreateUserRecord = require('../userRecordCreator').makeGetOrCreateUserRecord;

const expect = require('chai').expect;

describe("createUserRecord", () => {

    it('should create a new user record', async () => {

        const expectedValues = {
            ethAddress: "ethAddress1234",
            encryptionResult: "encryptionResult",
            getUserResult: undefined
        }

        const createUserRecord = makeCreateUserRecord(createTestDependencies(expectedValues));
        const userRecord = await createUserRecord("userId", "creatorId");

        expect(userRecord.userId).to.be.equal("userId");
        expect(userRecord.encryptedPrivateKey).to.be.equal(expectedValues.encryptionResult);
        expect(userRecord.creatorId).to.be.equal("creatorId");
        expect(userRecord.ethAddress).to.be.equal(expectedValues.ethAddress);
    })

    it('should return the existing record', async () => {
        const expectedValues = {
            getUserResult: { iAlready: "exist" }
        }

        const createUserRecord = makeCreateUserRecord(createTestDependencies(expectedValues));
        const userRecord = await createUserRecord("userId", "creatorId");

        expect(userRecord).to.deep.equal(expectedValues.getUserResult);
    })
})


function createTestDependencies(expectedValues) {
    const deps =
    {
        encryptionService: {
            encrypt: (input) => { return expectedValues.encryptionResult; }
        },
        userRecordRepository: {
            save: (user) => "not needed",
            get: (user) => { return expectedValues.getUserResult }
        },
        cryptoFunctions: {
            generateNewKey: () => {
                return {
                    ethAddress: expectedValues.ethAddress
                }
            }
        }
    }
    return deps;
}