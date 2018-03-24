const assert = require("assert");

module.exports = function makePublicRepository(context) {
    assert(context, 'context is required.')
    return {
        save: async (entry) => {
            try {
                context.bindings.registrationDocument = JSON.stringify(entry);
            }
            catch (err) {
                console.error(err);
            }
        }
    }
}