require('dotenv').config()

const dev = {
    stamperySecret : process.env.STAMPERY_SECRET_dev,
    ketteSecret : process.env.KETTE_SECRET_dev
};

const prod = {
    stamperySecret : process.env.STAMPERY_SECRET_prod,
    ketteSecret : process.env.KETTE_SECRET_prod
};

// Default to dev if not set
const config = process.env.STAGE === 'prod'
    ? prod
    : dev;

module.exports = config;