const User = require('../../models/userModel')
const Product = require('../../models/productsModel')

let userSession;


const loadWishlist = async (req,res) => {
    try {
        userSession = req.session;
        if(userSession.user_id){
        const userdata = await User.findById({_id:userSession.user_id})
        const completeuser = await userdata.populate('wishlist.item.productId')
            res.render('wishlist',{
                id:userSession.user_id,
                user:userdata,
                wishlistproducts:completeuser.wishlist
            })
        }else{
            res.redirect('user_signin')
        }

    }
    catch (error) {
        console.log(error.message)
    }
}

const addtowishlist = async(req,res)=>{
    try {
        const productId =req.query.id
        console.log('productId='+productId);
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        const productdata = await Product.findById({_id:productId})
        userdata.addToWishlist(productdata)
        res.redirect('/loadWishlist');
    } catch (error) {
        console.log(error.message);
    }

}

const addcartdeletewishlist = async(req, res) => {
    try {
        const userSession = req.session;
        const productId = req.query.id;
        console.log("productId="+productId);
        const userdata = await User.findById(userSession.user_id);
        const productdata = await Product.findById(productId);
        if (!userdata || !productdata) {
            return res.status(404).send("User or product not found");
        }
        await userdata.addToCart(productdata, 1);
        await userdata.removefromWishlist(productId);
        res.redirect('/loadWishlist');
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server error");
    }
};

const deletewishlist = async(req,res)=>{
    try {
        const productId = req.query.id
        userSession = req.session
        const userdata = await User.findById({_id:userSession.user_id})
        userdata.removefromWishlist(productId)
        res.status(200).redirect('/loadWishlist')
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    loadWishlist,
    addtowishlist,
    addcartdeletewishlist,
    deletewishlist
}