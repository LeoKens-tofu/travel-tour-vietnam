const router = require('express').Router();
const accountController = require('../../controllers/admin/account.controller');
const accountValidate = require('../../validates/admin/account.validate');
const authMiddle = require('../../middlewares/auth.middleware');

router.get('/login',accountController.login);

router.post('/login',accountValidate.loginPost,accountController.loginPost);

router.get('/register',accountController.register);

router.get('/register-initial',accountController.registerInit);

router.post('/register', accountValidate.registerPost , accountController.registerPost);

router.get('/forgot-password',accountController.forgotPassword);

router.post('/forgot-password',accountValidate.forgotPasswordPost ,accountController.forgotPasswordPost);

router.get('/otp-password',accountController.otpPassword);

router.post('/otp-password',accountValidate.otpPasswordPost,accountController.otpPasswordPost);

router.get('/reset-password',accountController.resetPassword);

router.post('/reset-password',authMiddle.verifyToken ,accountValidate.resetPasswordPost, accountController.resetPasswordPost);

router.post('/logout',accountController.logoutPost);

module.exports = router