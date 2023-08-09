const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController');
const authController=require('../controllers/auth');
const cartController=require('../controllers/customers/cartController');
const passport = require('passport');
const guest=require('../middlewares/guest');

router.get('/',homeController.home);

router.get('/cart',cartController.cartPage);

router.get('/register',guest,authController.register);

router.get('/login',guest,authController.login);

router.post('/update-cart',cartController.updateCart);

router.post('/register',authController.userRegister);

router.post('/login', passport.authenticate('local',{
failureRedirect : '/login',
successRedirect:'/',
badRequestMessage : 'All fields are required',
failureFlash: true}));

router.post('/logout',authController.logOut);

module.exports=router;