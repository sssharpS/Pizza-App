module.exports.register=(req,res)=>{
    return res.render('auth/register');
}

module.exports.login=(req,res)=>{
    return res.render('auth/login');
}