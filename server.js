const express = require('express');
const app=express();

const port=process.env.PORT || 3300;
const path = require('path');

app.set('view engine','ejs');


app.get('/',(req,res)=>{
    res.render('home');
})

app.listen(port,(err)=>{
    if(err){
        console.log("Error is occuring");
    }
    else{
        console.log(`server is running at port:${port}`);
    }
})