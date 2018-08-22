
const makeCreateBlockchainRecord = require('../src/blockChainService').makeCreateBlockchainRecord;

const expect = require('chai').expect;
const assert = require('chai').assert;

describe("blockChainService", () => {
    it('[createBlockchainRecord] -> should a record with correct date', async () => {

        const ketteSecret = "huhu kette secret";
        const transactionId = "hihi unique id";

        const expectedId = "my id is in here";
        const expectedHash = "My expected Hash"

        const timeAsString = "2018-05-10 19:06:00.270483";

        const expectedCompleteWebHook = process.env.WEBHOOK_BASE_URL + "/" + transactionId + "?ketteSecret=" + ketteSecret;

        const expectedResult = {
            id: expectedId,
            date: new Date(timeAsString),
            status: "pending"
        }

        const mockBlockchainService = {
            hash: (messageToHash) => {
                return expectedHash;
            },
            stamp: (hash, hook) => {
                expect(hash).to.be.equal(expectedHash);
                expect(hook).to.be.equal(expectedCompleteWebHook);
                return {
                    id: expectedId,
                    time: timeAsString
                }
            }
        }

        const createBlockchainRecord = makeCreateBlockchainRecord(mockBlockchainService, ketteSecret);

        const createBlockchainRecordResult = await createBlockchainRecord("mySignedMessage", transactionId);

        expect(createBlockchainRecordResult.date.toString()).not.to.be.equal("Invalid Date");
        expect(createBlockchainRecordResult).to.be.deep.equal(expectedResult);
    })
})