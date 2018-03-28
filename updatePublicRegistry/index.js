module.exports = function (context, req) {

    var receipt = req.body.blockchain_receipt;

    var registration = context.bindings.registrationDocuments[0];

    registration.receipt = receipt;

    context.bindings.registrationDocument = registration;

    context.res = {
        body: registration
    };

    context.done();
};