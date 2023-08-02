const Menu=require('../models/menu');



module.exports.home=async (req,res)=>{
    let pizzas=await Menu.find({});
        console.log(pizzas);
        return res.render('home',{pizzas:pizzas});

}