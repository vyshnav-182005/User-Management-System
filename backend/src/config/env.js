const dotenv = require('dotenv');
const path = require('path');

// Load backend/.env when present (local dev). On Vercel, env vars come from project settings.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const normalizeOrigin = (origin) => {
  const trimmed = origin.trim();
  if (!trimmed) {
    return trimmed;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }

  if (trimmed.includes('localhost') || trimmed.includes('127.0.0.1')) {
    return `http://${trimmed}`;
  }

  return `https://${trimmed}`;
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  mongoUri: process.env.MONGO_URI || process.env.MONGODB_URI,
  corsOrigin: (process.env.CORS_ORIGIN || 'user-management-system-btoajng9w.vercel.app')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  bcryptSaltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  cookieSecure:
    typeof process.env.COOKIE_SECURE === 'undefined'
      ? process.env.NODE_ENV === 'production'
      : process.env.COOKIE_SECURE === 'true',
  cookieSameSite: process.env.COOKIE_SAME_SITE || 'lax',
  cookieDomain: process.env.COOKIE_DOMAIN,
  adminEmail: process.env.ADMIN_EMAIL,
  adminUsername: process.env.ADMIN_USERNAME,
  adminPassword: process.env.ADMIN_PASSWORD,
};

const validateEnv = () => {
  const missing = [];

  if (!env.mongoUri) {
    missing.push('MONGO_URI or MONGODB_URI');
  }

  if (!env.jwtAccessSecret) {
    missing.push('JWT_ACCESS_SECRET or JWT_SECRET');
  }

  if (missing.length > 0) {
    throw new Error(`Missing required environment variable(s): ${missing.join(', ')}`);
  }
};

module.exports = {
  ...env,
  validateEnv,
};
