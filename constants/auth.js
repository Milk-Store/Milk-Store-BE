const AUTH = {
  TOKEN: {
    // Thời gian token
    ACCESS_TOKEN_EXPIRES: '1d', // 1 ngày
    REFRESH_TOKEN_EXPIRES: '30d', // 30 ngày

    // Thời gian sống cho cookies (milliseconds)
    ACCESS_TOKEN_COOKIE_MAX_AGE: 1 * 24 * 60 * 60 * 1000, // 1 ngày
    REFRESH_TOKEN_COOKIE_MAX_AGE: 30 * 24 * 60 * 60 * 1000, // 7 ngày
  },
  COOKIES: {
    // Tên cookies
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',

    // Các thuộc tính cho cookies
    HTTPONLY: true,
    SECURE_IN_PRODUCTION: true,
    SAME_SITE: 'strict',
    REFRESH_TOKEN_PATH: '/auth/refresh',
  },
  ROLES: {
    ADMIN: 'ROLE_ADMIN',
    STAFF: "ROLE_STAFF",
    USER: 'ROLE_USER',
  },
};

module.exports = { AUTH }; 