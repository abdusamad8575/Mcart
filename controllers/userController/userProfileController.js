const User = require('../../models/userModel')
const Address = require("../../models/addressModel")
const Order = require('../../models/orderModel')
const Product = require('../../models/productsModel')

let userSession;

const userProfile = async (req, res) => {
    try {
        userSession = req.session
        console.log("mon=" + req)
        const userDatas = await User.findOne({ _id: userSession.user_id })
        const addressdata = await Address.find({ userId: userSession.user_id })
        const orderdata = await Order.find({ userId: userSession.user_id }).sort({ createdAt: -1 })
        const product = orderdata.products;

        res.render('dashboard', { user: userDatas, useraddress: addressdata, userorders: orderdata, product: product })

    }
    catch (error) {
        console.log(error.message);
    }
}


const viewOrder = async (req, res) => {
    try {
        userSession = req.session
        if (userSession.user_id) {
            const id = req.query.id
            userSession.currentOrder = id
            const orderData = await Order.findById({ _id: id })
            const userData = await User.findById({ _id: userSession.user_id })
            await orderData.populate('products.item.productId')
            res.render("viewOrder", { order: orderData, user: userData })
        } else {
            res.redirect('/login')
        }


    } catch (error) {
        console.log(error.message);
    }

}


const cancelOrder = async (req, res) => {
    try {
        userSession = req.session;
        const userData = await User.findById({_id:userSession.user_id})
        if (userData) {
            const id = req.query.id;
            const orderData = await Order.findById({ _id: id })
            const productData = await Product.find()
                for (let key of orderData.products.item) {
                    for (let prod of productData) {
                        console.log(key.productId);
                        if (new String(prod._id).trim() == new String(key.productId).trim()) {
                            prod.quantity = prod.quantity + key.qty
                            await prod.save()
                        }
                    }
                }
                if(orderData.payment === "Razorpay"){
                    console.log("payraz");
                    walletPrice = userData.wallet;
                    returnPrice = orderData.products.totalprice;
                    changePrice = walletPrice+returnPrice;
                    console.log("changePrice="+changePrice);
                    await userData.updateOne({ $set: { wallet: changePrice } })
                    console.log("payraz");
                }
            await Order.deleteOne({ _id: id })
            res.redirect('/userProfile')
        }
        else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }

}


const returnOrder = async (req, res) => {
    try {
        userSession = req.session;
        const userData = await User.findById({_id:userSession.user_id})

        if (userData) {
            const id = req.query.id;
            const orderData = await Order.findById({ _id: id })
            for (let i = 0; i < orderData.products.item.length; i++) {
                orderData.productReturned[i] = 1;
            }
            await orderData.save();

            const productData = await Product.find()
                for (let key of orderData.products.item) {
                    for (let prod of productData) {
                        console.log(key.productId);
                        if (new String(prod._id).trim() == new String(key.productId).trim()) {
                            prod.quantity = prod.quantity + key.qty
                            await prod.save()
                        }
                    }
                }
                if(orderData.payment === "Razorpay"){
                    console.log("payraz");
                    walletPrice = userData.wallet;
                    returnPrice = orderData.products.totalprice;
                    changePrice = walletPrice+returnPrice;
                    await userData.updateOne({ $set: { wallet: changePrice } })
                }
                await Order.findByIdAndUpdate({ _id: id }, { $set: { status: "return" } })
           
            
            res.redirect('/userProfile')
        }
        else {
            res.redirect('/login')
        }
    } catch (error) {
        console.log(error.message);
    }

}

const addAddress = async (req, res) => {
    try {
        userSession = req.session
        const addressdata = Address({
            userId: userSession.user_id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            country: req.body.country,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            phone: req.body.phone
        })
        await addressdata.save();
        const checkindId = req.query.id;
        if (checkindId) {
            res.redirect('/getCheckout')
        } else {
            res.redirect('/userProfile')
        }


    }
    catch (error) {
        console.log(error.message);
    }
}

const deleteAddress = async (req, res) => {
    try {

        const id = req.query.id;
        await Address.deleteOne({ _id: id })
        res.redirect('/userProfile')
    } catch (error) {
        console.log(error.message);
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message)
    }
}


const changePassWord = async (req, res) => {
    try {
        const userSession =req.session;
        const name = req.body.name;
        const number = req.body.umber;
        const email = req.body.email;
        const newPassword = req.body.password1;

        const secure_password = await securePassword(newPassword)

        const updatedData = await User.updateOne({id:userSession._id},{$set:{
            name:name,
            mobile:number,
            email:email,
            password:secure_password
        }})
        if(updatedData){
            res.redirect('/userProfile')
        }
        // res.status(200).redirect('/userProfile')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    userProfile,
    viewOrder,
    cancelOrder,
    addAddress,
    deleteAddress,
    changePassWord,
    returnOrder
}