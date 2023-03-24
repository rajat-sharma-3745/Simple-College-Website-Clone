const mongoose =require("mongoose");
require('dotenv/config');
mongoose.connect(process.env.DB,{ useNewUrlParser: true,
useUnifiedTopology: true}).then(()=>{
      console.log("database connected");
}).catch((e)=>{
      console.log(e+"failed connection");
})

const schema=new mongoose.Schema({
      firstname:{
            type:String,
            required:true
      },
      lastname:{
            type:String,
            required:true
      },
      email:{
            type:String,
            required:true
      },
      image:{
            type:String,
            required:true
      },
      phone:{
            type:Number,
            required:true
      },
      dob:{
            type: String,
            required:true
      },
      course:{
            type:String,
            required:true
      },
      age:{
            type:String,
            required:true
      },
      gender:{
            type:String,
            required:true
      },
      address:{
            type:String,
            required:true
      },
      password:{
            type:String,
            required:true
      },
      is_verified:{
            type:Number,
            default:0
      }
})

const usermodel=mongoose.model('Registereduser',schema);
module.exports=usermodel;