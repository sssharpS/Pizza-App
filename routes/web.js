const express=require('express');
const router=express.Router();
const homeController=require('../controllers/homeController');
const authController=require('../controllers/auth');
const cartController=require('../controllers/customers/cartController');
const passport = require('passport');
const guest=require('../middlewares/guest');
const orderController=require('../controllers/customers/orderController');
const adminController=require('../controllers/admin/orderController');
const {auth}=require('../middlewares/auth');
const {admin} = require('../middlewares/admin');
const statusController=require('../controllers/admin/statusController');

router.get('/',homeController.home);

router.get('/cart',cartController.cartPage);

router.get('/register',guest,authController.register);

router.get('/login',guest,authController.login);

router.post('/update-cart',cartController.updateCart);

router.post('/register',authController.userRegister);

router.post('/login', passport.authenticate('local',{
failureRedirect : '/login',
badRequestMessage : 'All fields are required',
failureFlash: true}),(req,res)=>{
    if(req.user.role=='admin'){
        return res.redirect('/admin/orders');
    }
    else{
        return res.redirect('/customers/order');
    }
});

router.post('/logout',authController.logOut);

//customer routes
router.post('/orders',auth,orderController.orders);
router.get('/customers/order',auth,orderController.myOrders);
router.get('/customers/order/status/:id',auth,orderController.orderStatus);

//admin routes

router.get('/admin/orders',admin,adminController.getOrder);
router.post('/admin/order/status',admin,statusController.changeStatus);




module.exports=router;