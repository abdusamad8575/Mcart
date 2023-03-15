const express = require("express");
const user_route = express();
const session = require("express-session");
const block = require('../middleware/userBlocking')

const config = require("../config/config");

user_route.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

const auth = require("../middleware/auth");
// const adminAuth = require('../middleware/adminAuth')

user_route.set("views", "./views/users");

user_route.use(block)


const userController = require("../controllers/userController/userController");
// const categoryFillter = require("../controllers/categoryFillterController");


user_route.get("/", auth.isLogout, userController.homePageRead);
user_route.get("/home",  userController.homePageRead);

user_route.get("/register", auth.isLogout, userController.loadRegister);
user_route.post("/register", userController.insertUser,userController.loadOtp);

user_route.get("/otp", auth.isLogout, userController.loadOtp);
user_route.post("/otp", auth.isLogout, userController.verifyOtp);


user_route.get("/user_signin", auth.isLogout, userController.loginLoad);
user_route.post("/user_signin", userController.verifyLogin);

user_route.get("/loadForgotNumber", auth.isLogout, userController.loadForgotNumber);
user_route.post("/forgot", userController.forgotVerifyNumber);
user_route.get("/forgot",auth.isLogout, userController.forgotVerifyNumber);
user_route.post("/verifyForgotOtp", userController.verifyForgotOtp);
user_route.post("/verifyForgotPassword", userController.verifyForgotPassword);


user_route.get("/logout", auth.isLogin, userController.userLogout);


// user profile
const userProfileController = require('../controllers/userController/userProfileController') 

user_route.get("/userProfile", auth.isLogin,userProfileController.userProfile);

user_route.get("/viewOrder",auth.isLogin,userProfileController.viewOrder);

user_route.get("/cancelOrder",auth.isLogin, userProfileController.cancelOrder);

user_route.get("/returnOrder",auth.isLogin, userProfileController.returnOrder);


user_route.post("/addAddress",auth.isLogin, userProfileController.addAddress);

user_route.get("/deleteAddress",auth.isLogin, userProfileController.deleteAddress);

user_route.post("/changePassWord",auth.isLogin, userProfileController.changePassWord);


// products Details
const productController = require('../controllers/userController/productController');

user_route.get("/products", productController.productsLoad);

user_route.get("/productDetails",auth.isLogin,productController.productsDetailsLoad)

user_route.post('/products/search', productController.searchProducts) 

user_route.get('/priceSorting', productController.priceSorting) 

user_route.get('/priceFiltering', productController.priceFiltering) 

user_route.get('/colorFiltering', productController.colorFiltering)

// searchProduct


// cart
const cartController = require('../controllers/userController/cartController')

user_route.get("/addToCart",auth.isLogin,cartController.addToCart)

user_route.get("/loadCart",auth.isLogin,cartController.loadCart)

user_route.post("/editCart",cartController.editCart)

user_route.get("/removeItem",auth.isLogin,cartController.removeItem)

//wishlist
const wishlistController = require('../controllers/userController/wishlistController')

user_route.get("/loadWishlist",auth.isLogin,wishlistController.loadWishlist)

// user_route.get('/addtowishlist/:id',wishlistController.addtowishlist)

user_route.get('/addtowishlist',auth.isLogin,wishlistController.addtowishlist)

user_route.get('/addcartdeletewishlist',auth.isLogin,wishlistController.addcartdeletewishlist)

user_route.get('/deletewishlist',auth.isLogin,wishlistController.deletewishlist)




// checkout
const checkoutDetailsController = require('../controllers/userController/checkoutDetailsController')

user_route.get("/getCheckout",auth.isLogin,checkoutDetailsController.getCheckout)

user_route.get("/deleteAddressInCheckout",auth.isLogin, checkoutDetailsController.deleteAddressInCheckout);

user_route.get("/loadordersuccess",auth.isLogin,checkoutDetailsController.loadsuccess)

user_route.get("/paymentFailure",auth.isLogin,checkoutDetailsController.paymentFailure)

user_route.post("/addOrderDetails",auth.isLogin,checkoutDetailsController.addOrderDetails)

user_route.post("/addCouponValue",auth.isLogin,checkoutDetailsController.addCouponValue)


module.exports = user_route;
