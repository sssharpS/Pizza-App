const Order=require('../../models/order');

module.exports.changeStatus=(req,res)=>{
   
Order.updateOne({_id:req.body.orderId},{status:req.body.status}).then(data =>{
   
    //Emit event
    const eventEmitter=req.app.get('eventEmitter');
    eventEmitter.emit('orderUpdated',{id:req.body.orderId,status:req.body.status});

   return res.redirect('/admin/orders')
}).catch(err =>{
    return res.redirect('/admin/orders');
})


}