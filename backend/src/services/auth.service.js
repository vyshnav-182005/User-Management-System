const ApiError = require('../utils/apiError');
const User = require('../models/User');
const { USER_STATUSES } = require('../utils/constants');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} = require('./token.service');

const sanitizeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  username: user.username,
  role: user.role,
  status: user.status,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

const login = async ({ loginId, password }) => {
  const user = await User.findOne({
    $or: [{ email: loginId.toLowerCase() }, { username: loginId }],
  }).select('+password +refreshTokenHash');

  if (!user) {
    throw new ApiError(401, 'Invalid credentials');
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid credentials');
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(403, 'User account is inactive');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  if (refreshToken) {
    user.refreshTokenHash = hashToken(refreshToken);
    await user.save();
  }

  return {
    accessToken,
    refreshToken,
    user: sanitizeUser(user),
  };
};

const refreshSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, 'Refresh token is required');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (error) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.sub).select('+refreshTokenHash');

  if (!user || !user.refreshTokenHash) {
    throw new ApiError(401, 'Refresh token is invalid');
  }

  if (user.refreshTokenHash !== hashToken(refreshToken)) {
    throw new ApiError(401, 'Refresh token mismatch');
  }

  if (user.status !== USER_STATUSES.ACTIVE) {
    throw new ApiError(403, 'User account is inactive');
  }

  const accessToken = signAccessToken(user);
  const nextRefreshToken = signRefreshToken(user);

  if (nextRefreshToken) {
    user.refreshTokenHash = hashToken(nextRefreshToken);
    await user.save();
  }

  return {
    accessToken,
    refreshToken: nextRefreshToken,
    user: sanitizeUser(user),
  };
};

const logout = async (userId) => {
  const user = await User.findById(userId).select('+refreshTokenHash');
  if (!user) {
    return;
  }

  user.refreshTokenHash = null;
  await user.save();
};

module.exports = {
  login,
  refreshSession,
  logout,
};
