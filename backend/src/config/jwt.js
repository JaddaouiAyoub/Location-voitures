require('dotenv').config();

module.exports = {
    // JWT Access Token Configuration
    jwtSecret: process.env.JWT_SECRET || 'default_secret_key',
    jwtExpire: process.env.JWT_EXPIRE || '24h',

    // JWT Refresh Token Configuration
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret_key',
    jwtRefreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
};
