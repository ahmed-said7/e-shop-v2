let mongoose = require('mongoose');
let productModel=require('../models/productModel');
let reviewShema=new mongoose.Schema({
    title:{
        type:String,
    },
    rating:{
        type:Number,
        min:[1,"min value of rating is 1"],
        max:[5,"max value of rating is 5"],
        required:[true,"required value of rating "]
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref:"Product",
        required:true,
    }
    },
    {timestamps:true});


reviewShema.pre(/^find/,function(next){
    this.populate({path:'user' , select:'name'});
    next();
});

reviewShema.statics.calc=async function(productId){
    let result= await this.aggregate([
        {
            $match:{product:productId}
        }
        ,
        {
            $group:{
                _id:"product",
                averageRating:{$avg:"$rating"},
                ratingQuantity:{$sum:1}
            }
        }
                ]);
    if(result.length > 0){
        await productModel.findByIdAndUpdate(productId,{
            ratingsAverage:result[0].averageRating,
            ratingsQuantity:result[0].ratingQuantity
        })
    }
    else
    {
        await productModel.findByIdAndUpdate(productId,{
            ratingsAverage:0,
            ratingsQuantity:0
        });
    };
};

reviewShema.post('save',async function(){
    await this.constructor.calc(this.product);
})

reviewShema.post('remove',async function(){
    await this.constructor.calc(this.product);
})

let reviewModel=mongoose.model('Review',reviewShema);
module.exports=reviewModel;