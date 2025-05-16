const express = require('express');
const { register, login, forgotPassword } = require('../controllers/authController');
const { protect, restrictTo } = require('../middlewares/authMiddleware');

/*
##To Register an Admin User without Authentication middleware
const { registerAdmin } = require('../controllers/authController');
router.post('/register-admin', registerAdmin);
*/

const router = express.Router();

router.post('/register', protect, restrictTo('admin'), register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);

module.exports = router;
