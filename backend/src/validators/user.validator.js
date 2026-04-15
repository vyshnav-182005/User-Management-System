const { body, query, param } = require('express-validator');
const { ROLES, USER_STATUSES } = require('../utils/constants');

const createUserValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('Valid email is required'),
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role value'),
  body('status')
    .optional()
    .isIn(Object.values(USER_STATUSES))
    .withMessage('Invalid status value'),
];

const updateUserValidator = [
  param('id').isMongoId().withMessage('Invalid user id'),
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('email').optional().trim().isEmail().withMessage('Invalid email'),
  body('username').optional().trim().isLength({ min: 3, max: 50 }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
  body('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role'),
  body('status')
    .optional()
    .isIn(Object.values(USER_STATUSES))
    .withMessage('Invalid status'),
];

const listUsersValidator = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be >= 1'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be 1-100'),
  query('role').optional().isIn(Object.values(ROLES)).withMessage('Invalid role'),
  query('status').optional().isIn(Object.values(USER_STATUSES)).withMessage('Invalid status'),
  query('search').optional().trim().isLength({ max: 100 }),
];

const idValidator = [param('id').isMongoId().withMessage('Invalid user id')];

const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

module.exports = {
  createUserValidator,
  updateUserValidator,
  listUsersValidator,
  idValidator,
  updateProfileValidator,
};
