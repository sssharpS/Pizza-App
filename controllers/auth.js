const User=require('../models/user');
const passport = require('passport');
const bcrypt = require('bcrypt');

module.exports.register=(req,res)=>{
    return res.render('auth/register');
}

module.exports.login=(req,res)=>{
    return res.render('auth/login');
}

module.exports.userRegister=async (req,res)=>{
    // console.log(req.body);
    const {name,email,password}=req.body;
  
    // validate request
    if(!name || !email || !password){
        //send flash message to the front end
        req.flash('error','All fields are required');
        req.flash('name',name);
        req.flash('email',email);
        return res.redirect('/register');
    }


    //check if email already exists in db
    User.exists({email:email}).then(result =>{
        if(result){
            req.flash('error','email is already present');
            req.flash('name',name);
            req.flash('email',email);
            return res.redirect('/register');
        }
    }).catch(err =>{
        req.flash('name',name);
        req.flash('email',email);
         return res.redirect('/register');
    });

    //Hashed password
           const hashedPassword=await bcrypt.hash(password,10);

    //create a user
    const user=new User({
        name:name,
        email:email,
        password:hashedPassword
    });
  user.save().then(user =>{
    //Login

    return res.redirect('/');
  }).catch(err =>{
      req.flash('error','something went wrong');
       return res.redirect('/register');
  });

}

module.exports.logOut=(req,res,next)=>{
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/');
      });
}
