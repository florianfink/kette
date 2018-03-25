const assert = require("assert");

module.exports = function (context) {
    assert(context, 'context is required.')
    return {
        save: async (entry) => {
                context.bindings.registrationDocument = JSON.stringify(entry);
        },
        find: async (frameNumber) => {
            return context.bindings.registrationDocuments.find(x => x.frameNumber === frameNumber);
        }
    }
}