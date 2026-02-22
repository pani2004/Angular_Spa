import config from './env.config.js';

export default {
  secret: config.jwt.secret,
  accessTokenExpiration: config.jwt.accessExpiration,
  refreshTokenExpiration: config.jwt.refreshExpiration,
  
  accessTokenCookieOptions: {
    httpOnly: true,
    secure: config.node_env === 'production', 
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 
  },
  
  
  refreshTokenCookieOptions: {
    httpOnly: true,
    secure: config.node_env === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 
  },
  
  csrfCookieOptions: {
    httpOnly: false, 
    secure: config.node_env === 'production',
    sameSite: 'strict'
  }
};
