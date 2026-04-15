const User = require('../models/User');
const ApiError = require('../utils/apiError');
const { verifyAccessToken } = require('../services/token.service');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new ApiError(401, 'Missing or invalid authorization header');
    }

    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new ApiError(401, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Invalid or expired token'));
    }

    return next(error);
  }
};

module.exports = auth;
