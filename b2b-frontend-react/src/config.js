const dev = {
  STRIPE_KEY: "pk_test_v1amvR35uoCNduJfkqGB8RLD",
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-2-api-dev-attachmentsbucket-1oaogqz41j2cn"
  },
  apiGateway: {
    REGION: "us-east-1",
    URL: "https://uxd0ifjso8.execute-api.us-east-1.amazonaws.com/dev"
  },
  cognito: {
    REGION: "us-east-1",
    USER_POOL_ID: "us-east-1_FkjK4UxZV",
    APP_CLIENT_ID: "7s4qkqr0nrl5uks2hbfmsu787p",
    IDENTITY_POOL_ID: "us-east-1:98c42162-97a8-461c-a8d5-82eb0e4ebdbe"
  }
};

const prod = {
  STRIPE_KEY: "pk_test_v1amvR35uoCNduJfkqGB8RLD",
  s3: {
    REGION: "us-east-1",
    BUCKET: "notes-app-2-api-prod-attachmentsbucket-175uttt3tvcyb"
  },
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
