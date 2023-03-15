const mongoose = require("mongoose");
const Product = require('../models/productsModel')

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    wallet:{
        type:Number,
        default:0,
    },
    is_admin: {
        type: Number,
        default: 0
        // required: true
    },
    is_status: {
        type: Number,
        default: 1
        // required: true

    },
    cart: {
        item: [
            {
                productId: {
                    type: mongoose.Types.ObjectId,
                    ref: 'products',
                    required: true
                },
                productName: {
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                },
                price: {
                  type: Number
                }
            }
        ],
        totalPrice: {
            type: Number,
            default: 0
        }
    },
    wishlist:{
        item:[
            {
                productId:{
                    type:mongoose.Types.ObjectId,
                    ref:'products',
                    required:true
                },
                price:{
                    type:Number
                },
                size:{
                    type:Number
                }
            }
        ]
    }



});

userSchema.methods.addToCart = function (product) {
    const cart = this.cart
    console.log("cart is="+cart);
    const isExisting = cart.item.findIndex((objInItems) => {
        return (
            new String(objInItems.productId).trim() == new String(product._id).trim()
        )
    })
    console.log("isExisting is="+isExisting); //-1
    if (isExisting >= 0) {
        cart.item[isExisting].qty += 1
    } else {
        cart.item.push({ productId: product._id, productName:product.name, qty: 1, price: product.price })
    }
    cart.totalPrice += product.price
    console.log('User in schema:', this)
    return this.save()
}

userSchema.methods.removefromCart = async function (productId) {
    const cart = this.cart
    const isExisting = cart.item.findIndex(
      (objInItems) =>
        new String(objInItems.productId).trim() === new String(productId).trim()
    )
    if (isExisting >= 0) {
      const prod = await Product.findById(productId)
      cart.totalPrice -= prod.price * cart.item[isExisting].qty
      cart.item.splice(isExisting, 1)
      console.log('User in schema:', this)
      return this.save()
    }
  }

  userSchema.methods.addToWishlist = async function(product){
    const wishlist = this.wishlist
    const isExisting = wishlist.item.findIndex(objInItems =>{
    return new String(objInItems.productId).trim() == new String(product._id).trim()
  })
  if(isExisting >= 0){
  }else{
    wishlist.item.push({
        productId:product._id,
        price:product.price
    })
  }
  return this.save();
  }


  userSchema.methods.removefromWishlist = async function(productId){
    const wishlist = this.wishlist;
    const isExisting = wishlist.item.findIndex(item => new String(item.productId).trim() === new String(productId).trim());
    if(isExisting >= 0){
        // Remove the item from the wishlist
        wishlist.item.splice(isExisting, 1);

        // Save the updated wishlist
        await this.save();

        // Check if the product exists in the user's cart
        const existingCartItem = this.cart.item.find(item => new String(item.productId).trim() === new String(productId).trim());

        // If the product exists in the cart, do not add it again
        if (existingCartItem) {
          console.log('Product already exists in cart:', existingCartItem);
          return;
        }

        // Otherwise, add the product to the cart with quantity 1
        const product = await Product.findById(productId);
        console.log('product'+product);
        this.addToCart(product, 1);
    }
};

 module.exports = mongoose.model('user', userSchema)