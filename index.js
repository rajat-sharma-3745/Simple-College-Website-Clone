const express=require("express");
const app=express();
const ejs=require('ejs');
const path=require('path');
const routes=require('./router');

// const bodyParser = require("body-parser");


const port=process.env.PORT || 8000;

app.use(express.json());
// app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/",routes);
app.set('view engine','ejs');


app.listen(port,()=>{
      console.log("server running")
})