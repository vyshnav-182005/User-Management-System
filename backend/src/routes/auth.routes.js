const express = require('express');
const authController = require('../controllers/auth.controller');
const auth = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const { loginValidator, refreshValidator } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', loginValidator, validate, authController.login);
router.post('/refresh', refreshValidator, validate, authController.refresh);
router.post('/logout', auth, authController.logout);

module.exports = router;
