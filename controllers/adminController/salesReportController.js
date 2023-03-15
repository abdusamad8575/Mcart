const Product = require("../../models/productsModel");
const Order = require("../../models/orderModel");


const salesReport = async(req,res)=>{
    try {
        const productdata = await Product.find()
        res.render('salesReport',{product:productdata})
    } catch (error) {
        console.log(error.message);
    }
}

const datewiseReport = async(req,res)=>{
    try {
        const startdate = new Date(req.body.Startingdate)
        const enddate = new Date(req.body.Endingdate)
        const sales = await Order.aggregate([
            {
                $match:{
                    createdAt:{
                        $gte: startdate,
                        $lt: enddate
                    },
                    status:'Delivered',
                },
            },
            {
                $unwind:'$products.item',
            },
            {
                $group:{
                    _id:'$products.item.productId',
                    totalSales:{ $sum: '$products.item.price'},
                    quantity:{ $sum: '$products.item.qty'}
                },
            },
            {
                $lookup:{
                    from:'products',
                    localField:'_id',
                    foreignField:'_id',
                    as:'product'
                },
            },
            {
                $unwind:'$product',
            },
            {
                $project:{
                    _id:0,
                    name:'$product.name',
                    image:'$product.image',
                    category:'$product.category',
                    price:'$product.price',
                    createdAt:"$createdAt",
                    quantity:'$quantity',
                    sales:'$totalSales'


                },
            },
        ])
        res.render('datewisereport',{sales:sales});
    } catch (error) {
        console.log(error.message);
    }
}



module.exports = {
    salesReport,
    datewiseReport,
}