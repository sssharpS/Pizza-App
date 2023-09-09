
const Order=require('../../models/order');

module.exports.getOrder=async(req,res,next)=>{

    const orders=  await Order.find({status:{$ne:'completed'}},null,{sort:{createdAt:-1}}).populate('customer_Id','-password').exec();
     console.log(orders);
   //if the request is ajax
    if(req.xhr){
       res.json(orders);
    }
    else{
    return res.render('admin/orders');
    }


}
