const User = require('../../models/userModel')
const Product = require('../../models/productsModel')
const bcrypt = require('bcrypt');
const message = require("../../config/sms")
const Banner =  require("../../models/bannerModel")
let newUser;


const loadRegister = async (req, res) => {
    try {
        res.render('registration')

    }
    catch (error) {
        console.log(error.message)
    }
}

const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message)
    }
}
const insertUser = async (req, res, next) => {
    try {
        const NewEmail = req.body.email;
        newUser = {
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            password: req.body.password

        };
        const validate = await User.findOne({ email: NewEmail })
        if (validate) {
            res.render('registration', { message: "this user already exists" })
        } else {
            next()
        }

    }
    catch (error) {
        console.log(error.message);
    }
}


const loadOtp = async (req, res) => {

    const userData = newUser;
    console.log(userData);
    const mobile = userData.mobile;
    newOtp = message.sendMessage(mobile, res);
    console.log(newOtp);

    const phone = req.body.mno;
    res.render("otp", { newOtp, userData, mobileNo: phone, message: "" })
}

const  verifyOtp = async (req, res) => {
    try {
        const otp = req.body.newotp;
        console.log(req.body);
        console.log(req.body.otp);
        if (otp === req.body.otp) {
            const password = await bcrypt.hash(req.body.password, 10)
            const user = new User({
                name: req.body.name,
                email: req.body.email,
                mobile: req.body.mno,
                password: password

            })
            await user.save().then(() => console.log('register success'));
            res.redirect("/user_signin")
        }
        else {
            const userData = newUser;
            const phone = req.body.mno;
            res.render("otp", { newOtp, userData, mobileNo: phone, message: "invalid otp" })
            console.log("otp not match");
        }
    } catch (error) {
        console.log(error.message);
    }
}

const homePageRead = async (req, res) => {
    try {
        let page = req.query.page;
        let limit =12
        if(!page){
            skip=0
        }else{
            skip=page*12
        }
        Category = req.query.category;
        let userDatas
        if(req.session.user_id){
            userDatas = await User.findOne({ _id: req.session.user_id })
        }
        const products = await Product.find({isAvailable:1}).skip(skip).limit(limit);
        const categoryFind = await Product.find({ category: Category })
        const banners = await Banner.find({is_active:1});
        console.log(banners)
        if (!Category) {
            res.render('home', {
                user: userDatas,
                Products: products,
                banners:banners

            });
        } else {

            res.render('home', {
                user: userDatas,
                Products: categoryFind,
                banners:banners

            });

        }

    }
    catch (error) {
        console.log(error.message);
    }
};

const loginLoad = async (req, res) => {
    try {
        res.render('user_signin');
    }
    catch (error) {
        console.log(error.message);
    }
};


const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({ email: email, is_admin: 0 });
        console.log("user:" + userData)
        if (userData) {
            
            const passwordMatch = await bcrypt.compare(password, userData.password)
            if (passwordMatch) {
                if (userData.is_status == 1) {
                    req.session.user_id = userData._id;
                    req.session.user = userData.name;
                    req.session.user1 = true
                    res.redirect("/home")
                } else {
                    res.render('user_signin', { message: 'your account is blocked' })
                }



            }

            else {
                res.render('user_signin', { message: 'email and password are incorrect' })
            }
        }
        else {
            res.render('user_signin', { message: 'email and password are incorrect' })
        }



    }
    catch (error) {
        console.log(error.message);
    }
}

const loadForgotNumber = async (req, res) => {
    try {
        res.render('forgot')
    } catch (error) {
        console.log(error.message)
    }
}

const forgotVerifyNumber = async (req, res) => {
    try {
        const mobile = req.body.phone;
        newOtp = message.sendMessage(mobile, res);
        console.log(newOtp);
        res.render("forgotOtp", { newOtp, phone: mobile , message: "" })

    } catch (error) {
        console.log(error.message)
    }
}

const  verifyForgotOtp = async (req,res) => {

    try {
        const phoneNumber = req.body.phoneNumber;
        const enteredOtp = req.body.otp;
        const newOtp = req.body.newOtp;
        if (enteredOtp==newOtp) {
            res.render('resetPassword',{ phoneNumber})
            
        } else {
            res.render('forgotOtp',{ newOtp,phone: phoneNumber ,message: "invalid otp"})
        }
        
    } catch (error) {
        console.log(error.message);
    }

}

const verifyForgotPassword = async(req,res) => {

    try {
        const phoneNumber = req.body.phoneNumber;
        const newPassword = req.body.password;
        const email = req.body.email;

        const secure_password = await securePassword(newPassword)

        const updatedData = await User.updateOne({email:email},{$set:{password:secure_password}})
        if(updatedData){
            res.redirect('user_signin')
        }
        // res.status(200).redirect('/login')
        
    } catch (error) {
        console.log(error.message);
    }

}






const loadHome = async (req, res) => {
    try {
        if (req.session.user) {
            res.render('home', { user: req.session.user })
        }

        // res.render('home')
    }
    catch (error) {
        console.log(error.message)
    }
}


const userLogout = async (req, res) => {
    try {
        // req.session.destroy(function (err) {
        //     if (err) {
        //         console.log(err);
        //         res.send("Error")
        //     } else {
        //         res.redirect('/')
        //     }
        // })
        // req.session.user1 = null;
        // res.redirect('/')
        req.session.user_id = null;
        req.session.user = null;
        req.session.user1 = null
        res.redirect("/home")
    }
    catch (error) {
        console.log(error.message)
    }

}

const errorPage = (req,res) => {
    try {
            // res.status(404).json("error");
            res.render("error")
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    verifyOtp,
    loadOtp,
    homePageRead,
    loadRegister,
    insertUser,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    loadForgotNumber,
    forgotVerifyNumber,
    verifyForgotOtp,
    verifyForgotPassword,
    // paginetion,
    errorPage
}

