const dev = {
    stamperySecret : "_fill_me_in_dev",
    ketteSecret : "_fill_me_in_dev"
};

const prod = {
    stamperySecret : "_fill_me_in_prod",
    ketteSecret : "_fill_me_in_prod"
};

// Default to dev if not set
const config = process.env.STAGE === 'prod'
    ? prod
    : dev;

module.exports = config;