const mongoose = require("mongoose");
require('dotenv').config()

const DB = process.env.DBURL

mongoose.connect(DB,()=>{
   
  console.log("Database connected");
   mongoose.set('strictQuery',true);
});


const express = require("express");
const app = express();
const nocache = require("nocache");

app.set("view engine", "ejs");

app.use(express.static('public'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(nocache());
// user_route.use(express.static('public'))

//for user routes
const userRoute = require("./routes/userRoute");
app.use("/", userRoute);

// for admin routes
const adminRoute = require("./routes/adminRoute");
const { application } = require("express");
app.use("/admin", adminRoute);

app.get("*",(req,res)=>{
  res.status(404).drender("404");
})

app.listen(7000, function () {
  console.log("server is running at 7000");
});
