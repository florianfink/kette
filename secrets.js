require('dotenv').config()

const dev = {
    stripeSecretKey : process.env.STRIPESECRETKEY_dev,
    ketteSecret : process.env.KETTE_SECRET_dev,
    mnemonic : process.env.MNEMONIC_dev,
    infuraKey : process.env.INFURAKEY_dev
};

const prod = {
    stripeSecretKey : process.env.STRIPESECRETKEY_prod,
    ketteSecret : process.env.KETTE_SECRET_prod
};

// Default to dev if not set
const config = process.env.STAGE === 'prod'
    ? prod
    : dev;

module.exports = config;