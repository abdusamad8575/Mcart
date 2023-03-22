const User = require('../../models/userModel')
const Product = require('../../models/productsModel')
const Address = require("../../models/addressModel")
const Order = require('../../models/orderModel')
const Offer = require('../../models/offerModel')
const { loginLoad } = require('./userController')
const RazorPay = require("razorpay");

let userSession;
let order;
let gCouponTotal;
let updatedTotal,WalletAdding,cheking;


const getCheckout = async (req, res) => {
    try {
        userSession = req.session
        const id = req.query.address_id;
        const userdata = await User.findById({ _id: userSession.user_id })
        const completeuser = await userdata.populate('cart.item.productId')
        const walletAmount = await userdata.wallet;
        if (userSession.user_id && userdata.cart.totalPrice) {
            const addressdata = await Address.find({ userId: userSession.user_id })
            const selectaddress = await Address.findOne({ _id: id });
            res.render('checkout', {
                user: userdata,
                id: userSession.user_id,
                cartproducts: userdata.cart,
                qty: completeuser.cart.item.qty,
                addselect: selectaddress,
                useraddress: addressdata,
                walletAmount:walletAmount
            })
        }
        else {
            res.redirect('/loadCart')
        }
    }
    catch (error) {
        console.log(error.message);
    }

}


const deleteAddressInCheckout = async (req, res) => {
    try {

        const id = req.query.id;
        await Address.deleteOne({ _id: id })
        res.redirect('/getCheckout')
    } catch (error) {
        console.log(error.message);
    }
}

const addOrderDetails = async (req, res) => {
    try {
        console.log("body=" + req.body.payment)
        let payment;
        if(Array.isArray(req.body.payment)){
            payment = "Razorpay";
            cheking = "Wallet&Razorpay"
        }else{
            payment = req.body.payment;
            console.log("payment="+payment);
        }
        userSession = req.session
        if (userSession.user_id) {
            const userdata = await User.findById({ _id: userSession.user_id })
            var walletBalance = req.body.cost;
            const completeUser = await userdata.populate('cart.item.productId')
            const totalPrice = gCouponTotal || completeUser.cart.totalPrice;
            gCouponTotal=0;
            if(payment == 'wallet'){
                let walletAmount=parseInt(req.body.walamount);
                 WalletAdding =walletAmount-totalPrice;
                updatedTotal = totalPrice;
            }
            else if(walletBalance){
                updatedTotal = walletBalance;
                WalletAdding = 0;
                
            }else{
                updatedTotal=totalPrice;
            }
            
            

            if (userdata.cart.totalPrice > 0) {
                order = Order({
                    userId: userSession.user_id,
                    payment: payment,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    country: req.body.country,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                    zip: req.body.zip,
                    phone: req.body.phone,
                    products: userdata.cart,
                    // offer:userSession.offer,
                    // discount:userSession.offer.discount,    
                })
                const orderproductstatus = []
                for (const key of order.products.item) {
                    orderproductstatus.push(0)
                }
                // console.log("orderproductstatus=" + orderproductstatus);
                let totalprice = updatedTotal;
                order.productReturned = orderproductstatus
                order.products.totalprice = totalprice;
                // console.log("123="+order.products.totalprice);

                const productdetails = await Product.find({ isAvailable: 1 })
                for (let i = 0; i < productdetails.length; i++) {
                    for (let j = 0; j < order.products.item.length; j++) {

                        if (productdetails[i]._id.equals(order.products.item[j].productId)
                        ) {
                            productdetails[i].sales += order.products.item[j].qty;
                        }
                    }
                    productdetails[i].save();
                }

                console.log(req.body.payment);
                if (payment == 'cod') {
                    res.redirect('/loadordersuccess')
                } else if(payment == 'wallet'){
                    res.redirect('/loadordersuccess')
                }
                else if (payment == "Razorpay") {
                    var instance = new RazorPay({
                        key_id: process.env.KEY_ID,
                        key_secret: process.env.KEY_SECRET
                    })
                    console.log("ethan id="+order);
                    let razorpayOrder = await instance.orders.create({
                        amount: totalPrice * 100,
                        currency: 'INR',
                        receipt: order._id.toString()
                    })    
                    console.log('Order created', razorpayOrder);
                    res.render("razorpay", {
                        userId: req.session.user_id,
                        order_id: razorpayOrder.id,
                        total: totalprice,
                        session: req.session,
                        key_id: process.env.key_id,
                        user: userdata,
                        order: order,
                        orderId: order._id.toString()
                    });
                }
                else {
                    res.redirect('/getCheckout')
                }
            } else {
                res.redirect('/products')
            }
        }
        else {
            res.redirect('/user_signin')
        }

    }
    catch (error) {
        console.log(error.message)
    }
}

const paymentFailure = async (req, res) => {

    res.send('Payment Failure')

}

const  loadsuccess = async (req, res) => {
    try {
        userSession = req.session
        const userData = await User.findById({ _id: userSession.user_id })
        const address = await Address.findOne({ userId: userSession.user_id })
        if(cheking == 'wallet'||cheking){
             userData.wallet = WalletAdding;
             cheking = "";
        }
        
        userData.cart.totalPrice = updatedTotal;
        await userData.save();


        const orderdata = await order.save();
        userSession.currentorder = orderdata._id
        req.session.currentorder = order._id

        const productData = await Product.find()
        for (let key of userData.cart.item) {
            for (let prod of productData) {

                if (new String(prod._id).trim() == new String(key.productId._id).trim()) {
                    prod.quantity = prod.quantity - key.qty
                    await prod.save()
                }
            }
        }




        const order1 = await Order.findOne({ userId: userSession.user_id }).sort({ createdAt: -1 })
        if (userSession.user_id) {
            const userdata = await User.findById({ _id: userSession.user_id })
            const productdata = await Product.find();
            for (const key of userdata.cart.item) {
                console.log(key.productId, " + ", key.qty);
                for (const prod of productdata) {
                    if (new String(prod._id).trim() == new String(key.productId).trim()) {
                        prod.quantity = prod.quantity - key.qty
                        await prod.save
                    }
                }
            }
            await Order.find({
                userId: userSession.user_id
            })
            await Order.updateOne(
                { userId: userSession.user_id, _id: userSession.currentorder },
                { $set: { status: "Processing" } }
            )
            await User.updateOne(
                { _id: userSession.user_id },
                {
                    $set: {
                        "cart.item": [],
                        "cart.totalPrice": "0"
                    }
                },
                { multi: true }
            )
            console.log('order Built and cart is empty');
        }
        userSession.coupontotal = 0;
        res.render("orderSuccess", {
            user: userData,
            address: address,
            order: order1
        })
    } catch (error) {
        console.log(error.message);
    }
}


//coupon adding
const addCouponValue = async (req, res) => {
    const totalPrice = parseInt(req.body.total);
    let updatedTotal;
    let discount;
    let maxAmount, updatedlastTotal, discountAmount;
    // console.log("total12"+totalPrice);

    try {
        userSession = req.session;
        if (userSession.user_id) {
            // const userdata = await User.findById({_id:userSession.user_id});
            const offerdata = await Offer.findOne({ name: req.body.coupon })
            console.log("21");
            if (offerdata) {
                if (offerdata.expirydate < Date.now()) {
                    massege= "coupon expired";
                } else {
                    if (offerdata.usedBy.includes(userSession.user_id)) {
                        nocoupon = true;
                    } else {
                        // userSession.offer.name = offerdata.name;
                        // userSession.offer.type = offerdata.type;
                        // userSession.offer.discount = offerdata.discount;

                        if (totalPrice < offerdata.min_value) {
                            massege = "total amount less" + offerdata.min_value;
                        } else {
                            massege = " ";
                            updatedTotal =
                                // userdata.cart.totalPrice - (userdata.cart.totalPrice * userSession.offer.discount)/100 ;
                                totalPrice - (totalPrice * offerdata.discount) / 100;
                            userSession.coupontotal = updatedTotal;
                            gCouponTotal = updatedTotal;
                            maxAmount = totalPrice - updatedTotal;
                            if (maxAmount > offerdata.max_discount) {
                                updatedlastTotal = totalPrice - offerdata.max_discount;
                                discountAmount = offerdata.max_discount;

                            } else {
                                updatedlastTotal = updatedTotal;
                                discount = offerdata.discount;
                                discountAmount = maxAmount;
                            }


                            await offerdata.updateOne({ name: offerdata.name }, { $push: { usedBy: userSession.user_id } });

                        }

                    }

                }
                res.json({ updatedlastTotal, discount, massege, discountAmount });
            }
        } else {
            res.redirect("user_signin");
        }

    }
    catch (error) {
        console.log(error.message)
    }

}

module.exports = {
    getCheckout,
    deleteAddressInCheckout,
    addOrderDetails,
    loadsuccess,
    addCouponValue,
    paymentFailure
}