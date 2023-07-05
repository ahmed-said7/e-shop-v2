const mongoose  = require("mongoose");

let orderSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }
    ,cartItems:[
        {
            product:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Product",
            },
            price:Number,quantity:Number,color:String
        }
    ],
    isdelivered:{
        type:Boolean,default:false
    },
    deliveredAt:Date,
    ispaid:{
        type:Boolean,default:false
    },
    paidAt:Date,
    taxPrice:{
        type:Number,default:0
    }
    ,shippingPrice:{
        type:Number,default:0
    },
    paymentMethod:{
        type:String,default:"cash",enum:["cash","online"]
    },
    totalPrice:{
        type:Number
    },
    shippingAddress:{
        phone:String,
        details:String,
        city:String,
        postalCode:String
    }
},{timestamps:true});

// orderSchema.pre(/^find/,function(next){
    // this.populate({path:this.cartItems})
// });

let orderModel=mongoose.model('Order',orderSchema);

module.exports=orderModel;