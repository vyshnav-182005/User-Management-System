const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const env = require('../config/env');

const signAccessToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      username: user.username,
      email: user.email,
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn }
  );

const signRefreshToken = (user) => {
  if (!env.jwtRefreshSecret) {
    return null;
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      type: 'refresh',
    },
    env.jwtRefreshSecret,
    { expiresIn: env.jwtRefreshExpiresIn }
  );
};

const verifyAccessToken = (token) => jwt.verify(token, env.jwtAccessSecret);
const verifyRefreshToken = (token) => jwt.verify(token, env.jwtRefreshSecret);

const hashToken = (token) => crypto.createHash('sha256').update(token).digest('hex');

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  hashToken,
};
