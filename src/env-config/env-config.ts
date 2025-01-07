export default () => ({
  databaseUri: process.env.DATABASE_URI,
  port: process.env.PORT,
  jwtConfig: {
    secret: process.env.JWT_SECRET,
    global: true,
    expiresInSec: process.env.JWT_EXPIRES_IN_SEC,
  },
});
