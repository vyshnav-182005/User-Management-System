const express = require('express');
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { allowRoles } = require('../middleware/rbac.middleware');
const { ROLES } = require('../utils/constants');
const {
  createUserValidator,
  updateUserValidator,
  listUsersValidator,
  idValidator,
  updateProfileValidator,
} = require('../validators/user.validator');

const router = express.Router();

router.use(auth);

router.get('/me', userController.getProfile);
router.patch('/me', updateProfileValidator, validate, userController.updateProfile);

router.get(
  '/',
  allowRoles(ROLES.ADMIN, ROLES.MANAGER),
  listUsersValidator,
  validate,
  userController.listUsers
);

router.post(
  '/',
  allowRoles(ROLES.ADMIN),
  createUserValidator,
  validate,
  userController.createUser
);

router.patch(
  '/:id',
  allowRoles(ROLES.ADMIN, ROLES.MANAGER),
  updateUserValidator,
  validate,
  userController.updateUser
);

router.delete(
  '/:id',
  allowRoles(ROLES.ADMIN),
  idValidator,
  validate,
  userController.deleteUser
);

module.exports = router;
