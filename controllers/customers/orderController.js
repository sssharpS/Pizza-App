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
        Order.populate(result, {path:'customerId'}).then((placedOrder)=>{
         req.flash('success','order_placed')
         delete req.session.cart;
         
         //emit
         const eventEmitter=req.app.get('eventEmitter');
         eventEmitter.emit('orderPlaced',result);
 
           return res.redirect('/customers/order');
        }).catch(err =>{
         return res.redirect('/cart');
        })
       }).catch(err =>{
          return res.redirect('/cart');
       })

}

module.exports.myOrders= async(req,res) =>{

    const orders=await Order.find({customer_Id:req.user._id},null,{sort :{'createdAt' : -1}});
    return res.render('customers/order',{orders:orders,moment:moment});

}
module.exports.orderStatus=async(req,res)=>{

   const order=await Order.findById(req.params.id);

   //Authorise user
   if(req.user._id.toString()==order.customer_Id.toString()){
       return res.render('customers/singleOrder',{order});
   }
   return res.render('/');
}