const env = require('dotenv');
//Config env file
env.config();
const express = require('express');
const app=express();
const expressEjsLayouts = require('express-ejs-layouts');
const port=process.env.PORT || 3300;
const path = require('path');
const mongoose=require('./config/mongoose');
const session = require('express-session');
const flash=require('express-flash');
const MongoDbStore=require('connect-mongo');
const passport = require('passport');
const passportLocalStrategy=require('./config/passport');


//session config middleware
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store:MongoDbStore.create({
        mongoUrl:'mongodb://localhost/pizza',
        collection:'sessions'
     }),
    saveUninitialized: false,
    cookie: {maxAge:1000*60*60} //24hours
  }))

  app.use(flash());

//static middleware
app.use(express.static('assets'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// passport config
app.use(passport.initialize());
app.use(passport.session());

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session;
    res.locals.user=req.user;
    next();
})

app.set('view engine','ejs');
// app.set('views',path.join(__dirname+'/assets'));
app.use(expressEjsLayouts);

//route level middlewares
app.use('/',require('./routes/web'));


app.listen(port,(err)=>{
    if(err){
        console.log("Error is occuring");
    }
    else{
        console.log(`server is running at port:${port}`);
    }
})