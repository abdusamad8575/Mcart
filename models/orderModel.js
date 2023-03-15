const mongoose = require('mongoose')    
const User = require('../models/userModel')
const Product = require('../models/productsModel')


const orderSchema = new mongoose.Schema({

    userId:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true,  
    },
    payment:{
        type:String,
        required:true,
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
        required:true,
    },
    address:{
        type:String,
        required:true
    },
    city:{
        type:String,
        required:true
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
        required:true
    },
    createdAt:{
        type:Date,
        immutable: true,
        default: ()=> Date.now()
    },
    products:{ 
        item: [{
            productId:{
                type:mongoose.Types.ObjectId,
                ref:'products'
            },
            productName: {
                type:String
            },
            qty:{
                type:Number
            },
            price:{
                type:Number
            }
        }],
        totalprice:{
            type:Number,
            default:0
        }
    },
    status:{
        type:String,
        default:'Attempted'
    },
    productReturned:[{
        type:Number
    }]

},{timestamps:true})
module.exports = mongoose.model('Orders',orderSchema)