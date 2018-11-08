const assert = require("assert");
const makeDependencies = require("./userRecordCreatorDependencyMaker");

module.exports.makeGetOrCreateUserRecord = (deps) => {

    if (!deps) { deps = makeDependencies(); }

    const getOrCreateUserRecord = async (userId, creatorId) => {

        try {
            let userRecord = await deps.userRecordRepository.get(userId);
            if (!userRecord) {
                const key = deps.cryptoFunctions.generateNewKey();
                const privateKeyString = key.privateKeyString;
                const encryptedPrivateKey = await deps.encryptionService.encrypt(privateKeyString);
                userRecord = createRecord(userId, key.ethAddress, encryptedPrivateKey, creatorId);
                await deps.userRecordRepository.save(userRecord);
            }
            return userRecord;
        } catch (error) {
            console.log("ERROR: " + error)
        }
    }
    return getOrCreateUserRecord;
}


function createRecord(userId, ethAddress, encryptedPrivateKey, creatorId) {
    assert(userId, "[create user record] -> userId missing")
    assert(ethAddress, "[create user record] -> ethAddress missing")
    assert(encryptedPrivateKey, "[create user record] -> encryptedPrivateKey missing")
    assert(creatorId, "[create user record] -> creatorId missing")

    const userRecord = {
        userId: userId,
        ethAddress: ethAddress,
        encryptedPrivateKey: encryptedPrivateKey,
        creatorId: creatorId,
    };

    return userRecord;
}