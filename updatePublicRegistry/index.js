module.exports = function (context, req) {

    console.log(req);

    /*
    const receipt = req.query.blockchain_receipt;

    const registration = context.bindings.registrationDocuments[0];

    registration.receipt = receipt;

    context.bindings.registrationDocument = registration;
*/
    context.res = {
        body: req
    };

    context.done();
};