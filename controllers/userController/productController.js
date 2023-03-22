const User = require('../../models/userModel')
const Product = require('../../models/productsModel')
const catagory = require('../../models/categoryModel')

let findCatagory;

const productsLoad = async (req, res) => {
    try {
        

        let page = req.query.page;
        let limit =12
        if(!page){
            skip=0
        }else{
            skip=page*12
        }
        const userDatas = await User.findOne({ _id: req.session.user_id });
        const products = await Product.find({isAvailable:1,iscatagory:1}).skip(skip).limit(limit);
        let Category = req.query.catagory;
        console.log('123456'+Category);
        const categoryFind = await Product.find({ category: Category })
        if(Category == ',all'){
            console.log('2554');
            findCatagory = products
        }else{
            findCatagory = categoryFind
        }
        if (!Category) {
            res.render('products', {
                user: userDatas,
                Products: products

            });
        } else {
            res.json(findCatagory)

        }
    }
    catch (error) {
        console.log(error.message);
    }
};

const productsDetailsLoad = async (req, res ,next) => {
    try {
        const id = req.query.id;
        try{
        const productDitails = await Product.findOne({ _id: id })
        const userDatas = await User.findOne({ _id: req.session.user_id });
        res.render('product_details', { user: userDatas, product: productDitails });
        }catch(error){
            next(error)
        }
    }
    catch (error) {
        console.log(error.message);
    }

}

const searchProducts = async (req, res) => {
    const query = req.body.search;
    console.log(query);
    const products = await Product.find({
      name: { $regex: query, $options: "i" },
    });
    console.log(products);
    res.json(products);
  };


  const  priceSorting = async (req, res) => {
    try {
        console.log("hisamad");
        let products;
        const sortingStyle = req.query.sort;
        console.log("sortingStyle="+sortingStyle);
        if(sortingStyle == ',HighToLow'){
            products = await Product.find({}).sort({ price: -1 });
        }else if(sortingStyle == ',LowToHigh'){
            products = await Product.find({}).sort({ price: 1 });
        }else{
            products = await Product.find({});
        }
       
      res.json(products);
    } catch (error) {
      console.log(error.message);
    }
  };

const priceFiltering = async (req,res)=>{
    try{
        const data = req.query.data;
        console.log("data="+data);
        if(data == ",1"){
            productData = await Product.find({ isAvailable:1,iscatagory:1,price:{$gte:1000,$lte:10000}});
        }else if(data == ",2"){
            productData = await Product.find({ isAvailable:1,iscatagory:1,price:{$gte:10000,$lte:30000}});
        }else if(data == ",3"){
            productData = await Product.find({ isAvailable:1,iscatagory:1,price:{$gte:30000,$lte:50000}});
        }else if(data == ",4"){
            productData = await Product.find({ isAvailable:1,iscatagory:1,price:{$gte:50000,$lte:100000}});
        }else if(data == ",5"){
            productData = await Product.find({ isAvailable:1,iscatagory:1,price:{$gte:100000}});
        }
        res.json(productData);
    } catch (error) {
        console.log(error.message);
    }
    

}


const colorFiltering = async (req,res)=>{
    try{
        const color = req.query.data;
        console.log("data="+color);
        
            productData = await Product.find({ isAvailable:1,iscatagory:1,color});
        
        res.json(productData);
    } catch (error) {
        console.log(error.message);
    }
    

}

module.exports = {
    productsLoad,
    productsDetailsLoad,
    searchProducts,
    priceSorting,
    priceFiltering,
    colorFiltering
}