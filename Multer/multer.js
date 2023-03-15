const multer = require('multer')
const path =require('path')

const storage = multer.diskStorage({
    // destination:"./public/admin/assets/uploads/",
      destination: function (req, file, cb) {
        console.log("hello")
        if (file.fieldname !== 'image') {
            console.log("hello1"+file.fieldname)
          cb(null, 'public/admin/multer/img')
        } else {
            console.log("hello2")
          cb(null, 'public/admin/uploadedimages')
        }
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
      }
    
    })
    
    exports.upload = multer({ storage ,fileFilter: function (params, file, callback) {
       if (file.mimetype == "image/png" || file.mimetype == "image/jpeg" || file.mimetype == "image/jpg") {
        callback(null, true)
      } else {
        console.log('only jpg & png file supported !');
        callback(null, false)
   }
}
})