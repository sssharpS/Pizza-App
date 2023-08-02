const mongoose = require('mongoose');

const url="mongodb://127.0.0.1/pizza";


//where we have to connect
// {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true }
mongoose.connect(url);

//store the connection in a variable
const db=mongoose.connection;

db.on('err',console.error.bind(console,"failing in connecting to the database"));

db.once('open',()=>{
    console.log('successfully connected to the database');
})



module.exports=mongoose;



