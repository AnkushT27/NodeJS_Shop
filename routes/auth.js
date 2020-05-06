const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);
router.post('/logout', authController.postLogout);
router.get('/forget-password', authController.forgetPassword);
router.post('/forget-password', authController.postForgetPassword);
router.get('/reset-password/:token', authController.resetPassword);
router.post('/reset-password', authController.postResetPassword);
module.exports = router;