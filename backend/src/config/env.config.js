import dotenv from 'dotenv';
dotenv.config();

export default {
  node_env: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
  },
  
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    dynamodbEndpoint: process.env.DYNAMODB_ENDPOINT
  },
  
  dynamodb: {
    usersTable: process.env.USERS_TABLE || 'SPA-Users',
    refreshTokensTable: process.env.REFRESH_TOKENS_TABLE || 'SPA-RefreshTokens'
  },
  
  cors: {
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:4200'
  },
  
  cookie: {
    secret: process.env.COOKIE_SECRET
  }
};
