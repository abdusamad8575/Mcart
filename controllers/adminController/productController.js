
const fs = require("fs")
const Product = require("../../models/productsModel");
const Category = require("../../models/categoryModel");

const prodectManagement = async (req, res) => {
    try {
      const productDitails = await Product.find();
      res.render("products", { product: productDitails });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  const loadAddProduct = async (req, res) => {
    try {
      const categorydata = await Category.find();
      res.render("add_products", { category: categorydata });
    } catch (error) {
      console.log(error.message);
    }
  };


  const addproduct = async (req, res) => {
    console.log("hi" + req.files[0].filename);
    try {
  
      const images = req.files;
      const addProducts = Product({
        name: req.body.sName,
        category: req.body.sCategory,
        price: req.body.sPrice,
        quantity: req.body.sQuantity,
        ram: req.body.sRam,
        storage: req.body.sStorage,
        color: req.body.sColor,
        description: req.body.sDescription,
        rating: req.body.sRating,
        image: images.map((x) => x.filename)
      })
      await addProducts.save();
      const categorySelecter = await Category.find();
      res.render('add_products', { category: categorySelecter, message: "product adding successfull" })
  
  
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const deleteProduct = async (req, res) => {
    try {
      const id = req.query.id;
      await Product.deleteOne({ _id: id });
      res.redirect("prodectLoding");
  
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const editProduct = async (req, res) => {
    try {
      const id = req.query.id;
      const category = await Category.find();
      const product1 = await Product.findOne({ _id: id });
      res.render("edit_product", { category: category, product: product1 });
  
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const storeEditProduct = async (req, res) => {
    try {
  const oldImages = req.body.oldImage.split(",");
  let images = oldImages;
  
  if(req.files && req.files.length >0){
    const newImage = req.files.map((x) => x.filename)
  
    // images = [...newImage]
    images = [...oldImages,...newImage]
  }
  
      await Product.findByIdAndUpdate(
        { _id: req.body.id },
        {
          $set: {
  
            name: req.body.sName,
            category: req.body.sCategory,
            price: req.body.sPrice,
            ram: req.body.sRam,
            storage: req.body.sStorage,
            color: req.body.sColor,
            quantity: req.body.sQuantity,
            description: req.body.sDescription,
            rating: req.body.sRating,
            image: images
          },
        }
      );
      res.redirect('prodectLoding')
  
    } catch (error) {
      console.log(error.message);
    }
  }


//abijith
const deleteSingleImage = async(req,res)=>{
  try {
    let{pId , img}=req.body
    console.log(pId,img);
    await Product.updateOne({ _id: pId },{ $pull: { image: img } })
    fs.unlinkSync(`./public/admin/multer/img/${img}`);
    const productData = Product.findOne({_id:pId})
    console.log(productData);
    res.send({ newImage: productData.image});
  } catch (error) {
    console.log(error.message);
  }
};


  
  const blockproduct = async (req, res) => {
    try {
      
      const id = req.query.id
      console.log("id=" + id)
      const productData = await Product.findById({ _id: id })

      if (productData.isAvailable) {
        await Product.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 0 } })
        
      }
      else {
        await Product.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } })
      }
      res.redirect("prodectLoding");
  
    } catch (error) {
      console.log(error.message);
    }
  }


  module.exports = {
    storeEditProduct,
    editProduct,
    deleteProduct,
    addproduct,
    loadAddProduct,
    prodectManagement,
    deleteSingleImage,
    blockproduct
  }