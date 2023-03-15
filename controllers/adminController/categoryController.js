const Category = require("../../models/categoryModel");
const Product = require("../../models/productsModel");


const loadCategory = async (req, res) => {
    try {
      const categorydata = await Category.find();
      res.render("category_management", { category: categorydata, message: "" });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  const addcategory = async (req, res) => {
    try {
      const resendCaterory = req.body.category;
      const lowerCase = resendCaterory.toLowerCase();
      const findCaterory = await Category.findOne({ name: lowerCase })
  
      const categorydata = await Category.find();
      // randam category add
      if (findCaterory) {
        res.render("category_management", { category: categorydata, message: "category already add" });
      } else {
        const addcategory = Category({
          name: lowerCase
        });
        await addcategory.save();
        res.redirect("loadCategory");
      }
  
  
  
    } catch (error) {
      console.log(error.message);
    }
  }
  
  const loadEditCategory = async (req, res) => {
    try {
      id = req.query.id;
      const category = await Category.findOne({ _id: id })
      console.log(category)
      res.render("editCategory", { category: category });
  
    } catch (error) {
      console.log(error.message);
    }
  
  }
  
  const ubdateCategory = async (req, res) => {
    try {
  
      const resendCaterory = req.body.category;
      const lowerCase = resendCaterory.toLowerCase();
      const findCaterory = await Category.findOne({ name: lowerCase })
  
      const categorydata = await Category.find();
      if (findCaterory) {
        res.render("category_management", { category: categorydata, message: "category already add" });
      } else {
        await Category.findOneAndUpdate({
          $set: {
            name: lowerCase
          }
        })
        res.redirect('loadCategory')
      }
    } catch (error) {
      console.log(error.message);
    }
  
  }
  
  
  
  // const deleteCategory = async (req, res) => {
  //   try {
  //     const id = req.query.id;
  //     console.log(id);
  //     await Category.deleteOne({ _id: id });
  //     res.redirect("loadCategory");
  
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  const blockCatagory = async (req, res) => {
    try {
      const id = req.query.id
      const catagoryData = await Category.findById({ _id: id })
      const productData = await Product.find({category: catagoryData.name})
      console.log("sam="+productData);
      if (catagoryData.isAvailable) {
        await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 0 } })
        for(let i =0;i< productData.length;i++){
          await Product.findByIdAndUpdate({ _id: productData[i]._id }, { $set: { iscatagory: 0 } })
        }
        
      }
      else {
        await Category.findByIdAndUpdate({ _id: id }, { $set: { isAvailable: 1 } })
        for(let i =0;i< productData.length;i++){
          await Product.findByIdAndUpdate({ _id: productData[i]._id }, { $set: { iscatagory: 1 } })
        }
      }
      res.redirect("loadCategory");
  
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports = {
    ubdateCategory,
    loadEditCategory,
    // deleteCategory,
    addcategory,
    loadCategory,
    blockCatagory
  }