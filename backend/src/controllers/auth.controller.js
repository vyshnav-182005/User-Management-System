const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');
const authService = require('../services/auth.service');

const buildCookieBaseOptions = () => {
  const options = {
    httpOnly: true,
    secure: env.cookieSecure,
    sameSite: env.cookieSameSite,
  };

  if (env.cookieDomain) {
    options.domain = env.cookieDomain;
  }

  return options;
};

const buildCookieOptions = () => ({
  ...buildCookieBaseOptions(),
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const login = asyncHandler(async (req, res) => {
  const { loginId, password } = req.body;
  const { accessToken, refreshToken, user } = await authService.login({ loginId, password });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, buildCookieOptions());
  }

  return res.status(200).json({
    accessToken,
    refreshToken,
    user,
  });
});

const refresh = asyncHandler(async (req, res) => {
  const incomingToken = req.body.refreshToken || req.cookies.refreshToken;
  const { accessToken, refreshToken, user } = await authService.refreshSession(incomingToken);

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, buildCookieOptions());
  }

  return res.status(200).json({
    accessToken,
    refreshToken,
    user,
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);
  res.clearCookie('refreshToken', buildCookieBaseOptions());

  return res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = {
  login,
  refresh,
  logout,
};
