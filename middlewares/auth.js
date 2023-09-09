module.exports.auth=(req,res,next)=>{
    //it checks user is logged in 
    // it gets from the passport
    if(req.isAuthenticated()){
       return next();
    }
    return res.redirect('/login');
}