const express   =   require('express');

const router    =   express.Router();

const userController    =   require('../controllers/user_controller');

console.log('Router loaded');

router.get('/',userController.loginPage);
router.use('/users',require('./user'));
module.exports  =   router;
