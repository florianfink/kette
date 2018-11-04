const stripePackage = require("stripe");

exports.charge = async (amount, stripeToken) => {

    const stripe = stripePackage(secrets.stripeSecretKey);
    await stripe.charges.create({
        source: stripeToken,
        amount: amount,
        description: "KETTE registration charge",
        currency: "eur"
    });
}