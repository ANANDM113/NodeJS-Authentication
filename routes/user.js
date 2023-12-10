const express   =   require('express');

const router    =   express.Router();

const userController    =   require('../controllers/user_controller');
const passport = require('passport');

router.get('/login',userController.loginPage)
router.get('/forgotPassword',userController.forgotPassword);
router.get('/register',userController.registerYourself);
router.post('/createUser',userController.createUser);
router.post('/createSession',passport.authenticate('local',{failureRedirect:'/users/login'}),userController.createSession);
router.get('/dashboard',userController.dashBoard);
router.post('/sendEmail',userController.sendResetPasswordLinkViaEmail);
router.get('/resetPassword/:accessToken',userController.setNewPassword);
router.get('/setNewPassword/:accessToken',userController.setNewPasswordAfterLogIn);

router.post('/updatePassword/:accessToken',userController.updatePasswordInDataBase);
router.post('/updateNewPassword/:accessToken',userController.updatePasswordInDataBaseAfterLogIn);

router.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/users/login'}),userController.createSession);

router.get('/logout',userController.destroySession);

module.exports  =   router;
