const express = require("express");
const Router = express.Router();
const usermodel = require("./database");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const multer = require('multer');
const path = require('path');
require('dotenv/config');

// console.log(path.join(__dirname,"/public/userimages"))

const storage=multer.diskStorage({
      destination:function(req,file,cb){
cb(null,path.join(__dirname,"./public/userimages"));
      },
      filename:function(req,file,cb){
            const imagename=Date.now()+'-'+file.originalname;
cb(null,imagename);
      }
})
const upload = multer({ storage: storage });


//for encrypting password by hashing
const securepassword = async (password) => {
      try {
            const passhash = await bcrypt.hash(password, 10);
            return passhash;
      } catch (error) {
            console.log(error.message);
      }
}

//sending verify mail
const sendVerfiyMail = async (firstname, email, user_id) => {
      try {
            const transporter = nodemailer.createTransport({
                  service: "gmail",
                  host: "smtp.google.com",
                  // port:587,
                  secure: false,
                  requireTLS: true,
                  auth: {
                        user: "sharmarajat3745@gmail.com",
                        pass: "avuydpdpyxqxcage"
                  }
                  , tls: {
                        rejectUnauthorized: false
                  }
            })
            const mailOptions = {
                  from: "sharmarajat3745@gmail.com",
                  to: email,
                  subject: "For verification purpose",
                  html: "<p>Hi " + firstname + ",Thanks for signing up with us! You must follow this link of registration to activate your account: Please click here to <a href=https://college-site-project.onrender.com/verify?id=" + user_id + ">verify</a> your mail<br>Thank you</p>"
            }
            transporter.sendMail(mailOptions, function (error, info) {
                  if (error) {
                        console.log("email not sent" + error.message)
                  }
                  else {
                        console.log("email has been sent " + info.response);
                  }
            })

      } catch (error) {
            console.log(error.message);
      }
}



//for verify mail
const verifyMail = async (req, res) => {
      try {
            const updateinfo = await usermodel.updateOne({ _id: req.query.id }, { $set: { is_verified: 1 } });
            // console.log(updateinfo);
            res.render("email-verified");
      } catch (error) {
            console.log(error.message)
      }
}
Router.post('/registerr', upload.single('image'), async (req, res) => {
      try {
            // const { firstname,lastname, email,image, phone, dob,age,gender, course, address, password, confpassword } = req.body;
            const checkmail = req.body.email;
            const password = req.body.password;
            const confpassword = req.body.confpassword;
            // console.log(checkmail)
            const databasedata = await usermodel.findOne({ email: checkmail })

            const spassword = await securepassword(req.body.password);


            if (password === confpassword && databasedata === null) {
                  const data = new usermodel({
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        image: req.file.filename,
                        phone: req.body.phone,
                        dob: req.body.dob,
                        age: req.body.age,
                        gender: req.body.gender,
                        course: req.body.course,
                        address: req.body.address,
                        password: spassword
                  }
                  );
                  const savedata = await data.save();
                  // res.redirect("login")

                  if (savedata) {
                        sendVerfiyMail(req.body.firstname, req.body.email, savedata._id);
                        res.render("register", { message: "Registration successfull | Please verify your Mail..." })
                  }
                  else {
                        res.render("register", { message: "Registration Failed...." })

                  }
            }
            else if (checkmail === databasedata.email) {
                  res.render("register", { message: "Email  already exist" })

            }

            // else if(password !== confpassword){
            //       res.render("register", { message: "Password doesnot match" })
            // }
            else {
                  res.send("Some error Occured Go back");
            }
      } catch (error) {
            // res.send("error catch "+error);
            res.render('error');
      }
})


Router.post('/loginn', async (req, res) => {
      try {
            const email = req.body.email;
            const password = req.body.password;
            const databasedata = await usermodel.findOne({ email: email });
            if (databasedata) {
                  const passwordmatch = await bcrypt.compare(password, databasedata.password)
                  if (passwordmatch) {
                        if (databasedata.is_verified === 0) {

                              res.render("login", { message: "Please verify your email" });
                        } else {



                              res.render("userdetail", { user: databasedata })

                        }
                  } else {
                        res.render("login", { message: "Invalid Email or Password" });
                  }
            }
            else {
                  res.render("login", { message: "Invalid Email or Password" });
            }
            // res.send(databasedata)
            // console.log(databasedata)
      } catch (error) {
            //    res.send(error) 
            res.render('error');
      }

})

Router.get("/", (req, res) => {
      res.render("index", { title: "Govt PG College Bilaspur" });
})

Router.get("/about", (req, res) => {
      res.render("about", { title: "About | Govt PG College Bilaspur" })
})
Router.get("/courses", (req, res) => {
      res.render("courses", { title: "Course | Govt PG College Bilaspur" })
})
Router.get("/facilities", (req, res) => {
      res.render("facilities", { title: "Facilities | Govt PG College Bilaspur" })
})
Router.get("/gallery", (req, res) => {
      res.render("gallery", { title: "Gallery | Govt PG College Bilaspur" })
})
Router.get("/contact", (req, res) => {
      res.render("contact", { title: "Contact | Govt PG College Bilaspur" })
})
Router.get("/login", (req, res) => {
      res.render("login", { message: "" })
})
Router.get("/register", (req, res) => {
      res.render("register", { message: "" })
})

Router.get('/userdetail', (req, res) => {
      res.render("userdetail")
})


Router.get("/verify", verifyMail);

Router.get("/courses-info/ba", (req, res) => {
      res.render("courses-info/ba", { title: "Bachelor of Arts | Govt PG College Bilaspur" })
})
Router.get("/courses-info/bsc", (req, res) => {
      res.render("courses-info/bsc", { title: "Bachelor of Science | Govt PG College Bilaspur" })
})
Router.get("/courses-info/bcom", (req, res) => {
      res.render("courses-info/bcom", { title: "Bachelor of Commerce | Govt PG College Bilaspur" })
})
Router.get("/courses-info/ma", (req, res) => {
      res.render("courses-info/ma", { title: "Master of Arts | Govt PG College Bilaspur" })
})
Router.get("/courses-info/msc", (req, res) => {
      res.render("courses-info/msc", { title: "Master of Science | Govt PG College Bilaspur" })
})
Router.get("/courses-info/mcom", (req, res) => {
      res.render("courses-info/mcom", { title: "Master of Commerce | Govt PG College Bilaspur" })
})
Router.get("/courses-info/bca", (req, res) => {
      res.render("courses-info/bca", { title: "Bachelor of Computer Applications | Govt PG College Bilaspur" })
})
Router.get("/courses-info/bba", (req, res) => {
      res.render("courses-info/bba", { title: "Bachelor of Business Adminstration | Govt PG College Bilaspur" })
})
Router.get("/courses-info/bta", (req, res) => {
      res.render("courses-info/bta", { title: "Bachelor of Tourism Applications | Govt PG College Bilaspur" })
})



Router.get("*", (req, res) => {
      res.render("error");
})


module.exports = Router;