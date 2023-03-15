const User = require("../../models/userModel");


const userManegment = async (req, res) => {
    try {
      var search = "";
      if (req.query.search) {
        search = req.query.search;
      }
      const userData = await User.find({
        is_admin: 0,
        $or: [
          { name: { $regex: ".*" + search + ".*" } },
          { email: { $regex: ".*" + search + ".*" } },
          { mobile: { $regex: ".*" + search + ".*" } },
        ],
      });
      res.render("userManegment", { users: userData });
    } catch (error) {
      console.log(error.message);
    }
  };
  
  
  const blockuser = async (req, res) => {
    try {
      const id = req.query.id
      const userdata = await User.findById({ _id: id })
      if (userdata.is_status) {
        await User.findByIdAndUpdate({ _id: id }, { $set: { is_status: 0 } })
        
      }
      else {
        await User.findByIdAndUpdate({ _id: id }, { $set: { is_status: 1 } })
      }
      res.redirect('/admin/userManegment')
    } catch (error) {
      console.log(error.message);
    }
  }

  module.exports = {
    blockuser,
    userManegment
  }