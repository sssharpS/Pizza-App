const mongoose = require('mongoose');



//where we have to connect
// {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true }
mongoose.connect(process.env.CONNECTION_URL);

//store the connection in a variable
const connection=mongoose.connection;

connection.on('err',console.error.bind(console,"failing in connecting to the database"));

connection.once('open',()=>{
    console.log('successfully connected to the database');
})



module.exports=mongoose;



