const { body } = require('express-validator');

const loginValidator = [
  body('loginId').trim().notEmpty().withMessage('Email or username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

const refreshValidator = [
  body('refreshToken').optional().isString().withMessage('refreshToken must be a string'),
];

module.exports = {
  loginValidator,
  refreshValidator,
};
