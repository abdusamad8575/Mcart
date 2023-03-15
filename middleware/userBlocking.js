const User = require('../models/userModel')
module.exports = async (req, res, next) => {
    try {
        if (req.session.user_id) {
            const userData = await User.findOne({_id:req.session.user_id})
            if(userData.is_status){
                next();
            }else{
                req.session.user_id = null;
                req.session.user = null;
                req.session.user1 = null
                // res.render("user_signin",{message:'Admin Blocked'})
                next();
            }
        }
        else {
            next();

        } 
    } catch (error) {
        console.log(error.message);
    }
}