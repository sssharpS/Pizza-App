
module.exports.cartPage=(req,res)=>{
  res.render('customers/cart');
}

module.exports.updateCart=(req,res)=>{

     // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // for the first time creating cart and adding basic object structure
    if(!req.session.cart){
        req.session.cart={
          items:{},
          totalQty:0,
          totalPrice:0
        }
    }
    let cart=req.session.cart;
    // console.log(req.body);
    // check if item doesn't exist in the cart

      if(!cart.items[req.body._id]){
          cart.items[req.body._id]={
            item:req.body,
            qty:1
          }
      }
      else {
        cart.items[req.body._id].qty=cart.items[req.body._id].qty+1;
      }
      cart.totalQty=cart.totalQty+1;
      cart.totalPrice=cart.totalPrice+req.body.price;
    //  return res.json({data:"all ok"});
    return res.json({itemsCount:cart.totalQty});
}
