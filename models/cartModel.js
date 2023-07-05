const mongoose  = require("mongoose");

let cartSchema=new mongoose.Schema({
    cartItems:[
        {
            product:{
                ref:"Product",
                type:mongoose.Schema.ObjectId
            }
            ,
            price:Number,
            quantity:{
                type:Number,default:1
            }
            ,color:String
        }
    ],
    totalPrice:Number,
    totalPriceAfterDiscount:Number,
    user:{
        ref:"User",
        type:mongoose.Schema.ObjectId
    }
},{timestamps:true});

let cartModel=mongoose.model('Cart',cartSchema);

module.exports=cartModel;