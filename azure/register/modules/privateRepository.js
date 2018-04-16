"use strict";

const assert = require("assert");

module.exports = function (context) {
    assert(context, 'context is required.')
    assert(context.bindings, 'context.bindings is required.')

    return {
        save: async (user) => {
            context.bindings.userDocument = JSON.stringify(user);
        }
    }
}