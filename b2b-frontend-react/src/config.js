const dev = {
  apiGateway: {
    REGION: "eu-central-1",
    URL: "https://8lc7n8q4ml.execute-api.eu-central-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "eu-central-1",
    USER_POOL_ID: "eu-central-1_4plDryDkq",
    APP_CLIENT_ID: "4ikgja298up4t2c955d94h83sf",
    IDENTITY_POOL_ID: "eu-central-1:c9777e2d-ef46-4a98-b76e-c05f02652241"
  }
};

const prod = {
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://api.serverless-stack.seed-demo.club/prod"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_XUBDp4nnw",
    APP_CLIENT_ID: "44osnm1bl1vu4mhh1bva8jq36g",
    IDENTITY_POOL_ID: "us-east-1:aedd6077-5a37-489d-924e-adc8ea01dfcf"
  }
};

// Default to dev if not set
const config = process.env.REACT_APP_STAGE === 'prod'
  ? prod
  : dev;

export default {
  // Add common config values here
  MAX_ATTACHMENT_SIZE: 5000000,
  ...config
};
