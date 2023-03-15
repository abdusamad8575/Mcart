const User = require('../../models/userModel')
const Product = require('../../models/productsModel')
const Offer = require("../../models/offerModel")

let userSession;
let nocoupon;

const addToCart = async (req, res) => {
    try {
         const id = req.query.id;
        console.log("id1="+id);
        const singleProduct = await Product.findOne({ _id: id });
        userSession = req.session;
        const userData = await User.findById({ _id: userSession.user_id });
        userData.addToCart(singleProduct);
        res.redirect('loadCart');
    }
    catch (error) {
        console.log(error.message)
    }
}

const loadCart = async (req, res) => {
    try {
        console.log("dsection="+req.session.is_status);
        userSession = req.session
        const userData = await User.findById({ _id: userSession.user_id })
        const completeUser = await userData.populate('cart.item.productId')

        res.render('cart', {
            user: userData,
            cartProducts: completeUser.cart
        })
    }
    catch (error) {
        console.log(error.message)
    }
}

const removeItem = async (req, res) => {

    try {
        const productId = req.query.id
        userSession = req.session
        const userData = await User.findById({ _id: userSession.user_id })
        userData.removefromCart(productId)
        res.redirect('/loadCart')
    }
    catch (error) {
        console.log(error.message)
    }

}




const editCart = async (req, res) => {
   
   //chechi
   try {
    const { productId, qty } = req.body;
    const userId = req.session.user_id;

    const user = await User.findById(userId).populate("cart.item.productId");

    const cartItem = user.cart.item.find(
      (item) => item.productId._id.toString() === productId.toString()
    );

    const product = await Product.findById(productId);
    const productPrice = cartItem.productId.price;

    const qtyChange = qty - cartItem.qty;
    const stockChange = -qtyChange;
    console.log(stockChange);

    product.quantity -= stockChange;
    

    cartItem.qty = qty;
    cartItem.price = productPrice * qty;

    // recalculate the total price of the cart
    const totalprice = user.cart.item.reduce(
      (acc, item) => acc + item.price,
      0
    );
    user.cart.totalPrice = totalprice;

    // mark the cart and totalprice fields as modified
    user.markModified("cart");
    user.markModified("cart.totalPrice");

    // save the updated user document
    await user.save();

    // get the remaining stock count of each item in the cart
    const remainingStock = {};
    for (let item of user.cart.item) {
      const remainingStockCount = item.productId.quantity - item.qty;
      remainingStock[item.productId._id.toString()] = remainingStockCount;
    }
console.log(remainingStock);
    // send the updated subtotal, grand total, and remaining stock counts back to the client
    const subtotal = user.cart.item.reduce((acc, item) => acc + item.price, 0);
    const grandTotal = subtotal;
console.log("1="+subtotal+"2="+grandTotal+"3="+productPrice+"4="+qtyChange+"5="+stockChange+"6="+remainingStock);
    res.json({ subtotal, grandTotal, productPrice, qtyChange, stockChange, remainingStock });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating cart item");
  }
}

module.exports ={
    addToCart,
    loadCart,
    removeItem,
    editCart,
}