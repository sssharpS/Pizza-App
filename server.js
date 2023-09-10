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
const Emitter=require('events');


//Event Emitter
const eventEmitter=new Emitter();
// bind this in app
app.set('eventEmitter',eventEmitter);

//session config middleware
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    store:MongoDbStore.create({
        mongoUrl:'mongodb://localhost/pizza',
        collection:'sessions'
     }),
    saveUninitialized: false,
    cookie: {maxAge:1000*60*60*24} //24hours
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


const server=app.listen(port,(err)=>{
    if(err){
        console.log("Error is occuring");
    }
    else{
        console.log(`server is running at port:${port}`);
    }
})

//socket
const io=require('socket.io')(server);

io.on('connection',(socket)=>{
    //  console.log(socket.id);
   // Join - corresponding every order create a private room by the client and join
   //getting a room

  socket.on('join',(orderId)=>{

     console.log(orderId);

       socket.join(orderId);
  })

});

//receives

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced',(data)=>{
    //we have created room-adminRoom now inside room we emit the message
    console.log(data);
  io.to('adminRoom').emit('orderPlaced',data);
})
