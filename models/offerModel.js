const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({ 
    name:{
        type:String,
        required:true,
    },
    // type:{
    //     type:String,
    //     required:true,
    // },
    discount:{
        type:Number,
        required:true,
    },
    min_value:{
        type:Number,
        required:true
    },
    // max_discount:{
    //     type:Number,
    //     required:true
    // },
    expirydate:{
        type:Date,
        required:true,
    },
    isAvailable:{
        type:Number,
        default:1
    },
    usedBy:[{
        type:mongoose.Types.ObjectId,
        ref:'user'
    }]
})

module.exports = mongoose.model('offer',offerSchema)