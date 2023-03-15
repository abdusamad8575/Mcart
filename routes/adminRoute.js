const express = require("express")
const admin_route = express();
const session = require("express-session");
// const nocache = require("nocache");
// const multer = require('multer');
// const path =require("path");
const multer = require("../Multer/multer")

const config = require("../config/config");
admin_route.use(session({ 
    secret: config.sessionSecretadmin,
    resave:false,
    saveUninitialized:true,    
}));


const auth = require("../middleware/adminAuth");

admin_route.set('views', './views/admin');

const adminController = require("../controllers/adminController/adminController");

admin_route.get('/', auth.isLogout, adminController.loadLogin);

admin_route.post('/', adminController.verifyLogin);

admin_route.get('/logout', auth.isLogin, adminController.logout);


// deshbord Management
admin_route.get('/dashboard', auth.isLogin, adminController.loadDashboard);


// user Management
const usersDetailsController = require('../controllers/adminController/usersDetailsController') 

admin_route.get('/userManegment', auth.isLogin, usersDetailsController.userManegment);

admin_route.get('/blockuser',auth.isLogin,usersDetailsController.blockuser);


// product Management
const productController = require('../controllers/adminController/productController')

admin_route.get('/prodectLoding', auth.isLogin, productController.prodectManagement);

admin_route.get('/loadAddProduct',auth.isLogin,productController.loadAddProduct);

admin_route.post('/addproduct',multer.upload.array('sImage'),productController.addproduct)

admin_route.get('/deleteProduct',auth.isLogin,productController.deleteProduct)

admin_route.get('/editProduct',auth.isLogin,productController.editProduct)

admin_route.post('/storeEditProduct',multer.upload.array('sImage'),productController.storeEditProduct)

// admin_route.delete('/deleteSingleImage/:itemId/:imageName', productController.deleteSingleImage);

admin_route.post('/deleteSingleImage',auth.isLogin,productController.deleteSingleImage)

admin_route.get('/blockproduct',auth.isLogin,productController.blockproduct)


// category Management
const categoryController = require('../controllers/adminController/categoryController')

admin_route.get('/loadCategory',auth.isLogin,categoryController.loadCategory)

admin_route.post('/addcategory',categoryController.addcategory)

admin_route.get('/editCategory',auth.isLogin,categoryController.loadEditCategory)

admin_route.post('/ubdateCategory',categoryController.ubdateCategory)

// admin_route.get('/deleteCategory',auth.isLogin,categoryController.deleteCategory)

admin_route.get('/blockCatagory',auth.isLogin,categoryController.blockCatagory)


// order Management
const orderController = require('../controllers/adminController/orderController')

admin_route.get('/loadOrderManagement',auth.isLogin,orderController.loadOrderManagement)

admin_route.get('/cancelOrder',auth.isLogin,orderController.cancelorder)

admin_route.get('/orderDetails',auth.isLogin,orderController.orderDetails)

admin_route.post('/UpdateOrder',auth.isLogin,orderController.UpdateOrder)


//coupon Management
const offerController = require('../controllers/adminController/offerController')

admin_route.get('/offerManagement',auth.isLogin,offerController.offerManagement)

admin_route.post('/offerStore',auth.isLogin,offerController.offerStore)

admin_route.get('/deleteOffer',auth.isLogin,offerController.deleteOffer)

//banner management
const bannercontroller = require('../controllers/adminController/bannerController')

admin_route.get('/loadbannerManagement',auth.isLogin,bannercontroller.loadbannerManagement)

admin_route.post('/banner',multer.upload.array('bannerImage'),bannercontroller.addBanner)

admin_route.get('/chooseBanner',auth.isLogin,bannercontroller.chooseBanner)

admin_route.get('/deleteBanner',auth.isLogin,bannercontroller.deleteBanner)


//sales report
const salesReportController = require('../controllers/adminController/salesReportController')


admin_route.get('/salesReport', auth.isLogin,salesReportController.salesReport)

admin_route.post('/datewiseReport',auth.isLogin,salesReportController.datewiseReport)


admin_route.get('*', function (req, res) {
    res.redirect('/admin');
})


module.exports = admin_route;