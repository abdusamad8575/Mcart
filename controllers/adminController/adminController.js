const User = require("../../models/userModel");
const Product = require("../../models/productsModel");
const Category = require("../../models/categoryModel");
const Order = require("../../models/orderModel");

const bcrypt = require("bcrypt");

const loadLogin = async (req, res) => {
  try {
    res.render("login");
  } catch (error) {
    console.log(error.message);
  }
};

const verifyLogin = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const userData = await User.findOne({ email: email });

    if (userData) {
      const passwordMatch = await bcrypt.compare(password, userData.password);

      if (passwordMatch) {
        if (userData.is_admin === 0) {
          res.render("login", { message: "email and password incorrect" });
        } else {
          req.session.admin_id = userData._id;
          res.redirect("/admin/dashboard");
        }
      } else {
        res.render("login", { message: "email and password is incorrect" });
      }
    } else {
      res.render("login", { message: "email and password is incorrect" });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const loadDashboard = async (req, res) => {

  try {
        
    if(req.session.admin_id){
        isAdminLoggedin=true;
     const productData = await Product.find()
     const userdata = await User.find({is_admin:0})
    const adminData = await User.findOne({is_admin:1})
    const categorydata = await Category.find()

     const categoryArray = [];
     const ordercount = [];
     for(let key of categorydata){
        categoryArray.push(key.name)
        ordercount.push(0)
     }
     
     const completeorder = []
     const orderdata = await Order.find()
     for(let key of orderdata){
        const uppend = await key.populate('products.item.productId')
        completeorder.push(uppend)
     }

     const productName = [];
     const salesCount = [];
     const productnames = await Product.find();
     for(let key of productnames){
        productName.push(key.name);
        salesCount.push(key.sales)
     }

     for(let i=0; i<completeorder.length; i++){
        for(let j=0; j<completeorder[i].products.item.length; j++){
            const catdata = completeorder[i].products.item[j].productId.category
            const isexisting = categoryArray.findIndex(category=>{
                return category === catdata
            })
            ordercount[isexisting]++
        }
     }

     const showCount = await Order.find().count()
     const productCount = await Product.count()
     const userCount = await User.count({is_admin:0})
     const totalCategory = await Category.count({isAvailable:1})

    res.render('dashboard',{products:productData,
        users:userdata,
        admin:adminData,
        category:categoryArray,
        count:ordercount,
        pname:productName,
        pcount:salesCount,
        showCount,
        productCount,
        userCount,
        totalCategory
    })
    }else{
        res.redirect('/admin/adminLogin')
    }
}
catch (error) {
    console.log(error.message)
}
};

const logout = async (req, res) => {
  try {
    // console.log("hi logout")
    // req.session.destroy(function (err) {
    //   if (err) {
    //     console.log(err);
    //     res.send("Error")
    //   } else {
    //     res.redirect("/admin");
    //   }
    // })
    req.session.admin_id = null;

    res.redirect("/admin");


  } catch (error) {
    console.log(error.message);
  }
};







module.exports = {
  loadLogin,
  verifyLogin,
  loadDashboard,
  logout,
};
