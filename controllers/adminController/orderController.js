const Order = require("../../models/orderModel");

const loadOrderManagement = async (req, res) => {
    try {
        const orderdata = await Order.find().sort({ createdAt: -1 })

        console.log(orderdata);
        res.render('orderManagement', { order: orderdata })

    } catch (error) {
        console.log(error.message);
    }
}

const cancelorder = async (req, res) => {
    try {
        const id = req.query.id;
        await Order.deleteOne({ _id: id });
        res.redirect('loadOrderManagement')
    } catch (error) {
        console.log(error.message);
    }
}

const orderDetails = async (req, res) => {
    try {
        const id = req.query.id;
        const orderData = await Order.findById({ _id: id })
        await orderData.populate('products.item.productId')
        res.render("viewOrder", { order: orderData })

    } catch (error) {
        console.log(error.message);
    }
}

const UpdateOrder = async (req, res) => {
    try {
        let orderId = req.body.orderid;
        await Order.findByIdAndUpdate({ _id: orderId }, { $set: { status: req.body.status } })
        res.redirect("loadOrderManagement")
    } catch (error) {
        console.log(error.messaage);
    }
  }

module.exports = {
    orderDetails,
    cancelorder,
    loadOrderManagement,
    UpdateOrder
}