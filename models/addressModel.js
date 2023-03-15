const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user',
    },
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    },
    country:{
        type:String,
        reequired:true,
    },
    address:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    zip:{
        type:String,
        required:true,
    },
    phone:{
        type:String,
        required:true,
    },

})


module.exports = mongoose.model('Address',addressSchema) 