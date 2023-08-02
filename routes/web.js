const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController');
const authController=require('../controllers/auth');
const cartController=require('../controllers/customers/cartController');

router.get('/',homeController.home);

router.get('/cart',cartController.cartPage);

router.get('/register',authController.register);

router.get('/login',authController.login);

router.post('/update-cart',cartController.updateCart);

module.exports=router;