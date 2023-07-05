
let Review=require('../models/reviewModel');
let handler=require('express-async-handler');


let {getAll,getOne,deleteOne,updateOne,createOne}=require('../utils/handleFactor')

let setUserAndProductToBody=handler((req,res,next)=>{
    if(!req.body.product){
        req.body.product=req.params.productId;
    };
    if(!req.body.user){
        req.body.user=req.user._id;
    };
    next();
});

let setFilterObject=handler(async (req, res,next) => {
    if(req.params.productId){
        req.filter={product:req.params.productId};
    };
    next();
});

let getReviews=getAll(Review);
let updateReview=updateOne(Review);
let deleteReview=deleteOne(Review);
let getReview=getOne(Review);
let createReview=createOne(Review);
module.exports={getReviews, updateReview, deleteReview, createReview ,getReview
    ,setFilterObject,setUserAndProductToBody};