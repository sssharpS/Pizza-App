const Order=require('../../models/order');
const stripe=require('stripe')(process.env.STRIPE_KEY);

const moment = require('moment');

module.exports.orders=(req,res)=>{
   // console.log(req.body);
// validate request
   const {phone,address,token,paymentType}=req.body;
   if(!phone || !address){
      res.status(422).json({message :'All fields are required'});
     
   }
   async function helper(placedOrder){
      const paymentIntent = await stripe.paymentIntents.create({
         amount: req.session.cart.totalPrice  * 100,
         currency: 'inr',
         description:`Pizza order: ${placedOrder._id}`,
         //  client_secret:`${id}_secret_${token}`,

           payment_method_types: ["card"],
         // automatic_payment_methods: {enabled: true},
       });
   }
 
   const order=new Order({
    customer_Id:req.user._id,
    items:req.session.cart.items,
    phone,
    address
       });

   
       order.save().then(result =>{
        Order.populate(result, {path:'customerId'}).then((placedOrder)=>{
         // req.flash('success','order_placed')

      //Stripe payment
       if(paymentType==='card'){
         try{
           helper(placedOrder);
           placedOrder.paymentStatus=true;
           placedOrder.paymentType=paymentType;
           placedOrder.save().then((ord)=>{
            
               //emit
         const eventEmitter=req.app.get('eventEmitter');
         eventEmitter.emit('ord',result);
            delete req.session.cart;
            return res.json({success:'Payment done,order_placed successfully'});
           }).catch(err =>{
                  console.log(err);
           })
         }
         catch(err){
            delete req.session.cart;
            return res.json({success:'Order placed but payment failed,pay at the delivery time'});
         }
       }
       else{
            delete req.session.cart;
            return res.json({success:'order_placed successfully'});
       }
       
         //   return res.redirect('/customers/order');
        })
       }).catch(err =>{
         return res.stauts(500).json({error:'something went wrong'});
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