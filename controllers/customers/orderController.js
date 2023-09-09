const Order=require('../../models/order');

const moment = require('moment');

module.exports.orders=(req,res)=>{
//    console.log(req.body);
// validate request
   const {phone,address}=req.body;
   if(!phone || !address){
    req.flash('error','All fields are required');
   }
 
   const order=new Order({
    customer_Id:req.user._id,
    items:req.session.cart.items,
    phone,
    address
       });
   
       order.save().then(result =>{
        req.flash('success','order_placed')
        delete req.session.cart;
          return res.redirect('/customers/order');
       }).catch(err =>{
          return res.redirect('/cart');
       })

}

module.exports.myOrders= async(req,res) =>{

    const orders=await Order.find({customer_Id:req.user._id},null,{sort :{'createdAt' : -1}});
    return res.render('customers/order',{orders:orders,moment:moment});

}