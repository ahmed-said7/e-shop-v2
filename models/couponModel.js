let mongoose = require('mongoose');
let couponSchema=new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:[true,"name is required"],
        unique:true
    }
    ,
    expired:{
        type:Date,
        required:[true,"coupon expired is expired"],
    },
    discount:{
        type:Number,
        required:[true,"discount is required"],
    },
},{timestamps:true});

let couponModel=mongoose.model('Coupon',couponSchema);
module.exports=couponModel;