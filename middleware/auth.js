const isLogin = async (req, res, next) => {
  try {
    if (req.session.user1) {
      next();
    } else {
      res.redirect("/user_signin");   
    }
  } catch (error) {  
    console.log(error.message);
  }
};

const isLogout = async (req, res, next) => {
  try {
    if (req.session.user1) {
      res.redirect("/home");
    }
    // } else if (req.session.admin_id) {
    //   res.redirect('/admin/home');
    // }
    else {
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {
  isLogin,
  isLogout,
};
