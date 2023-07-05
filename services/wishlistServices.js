let User=require('../models/userModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');

let addProductToWishlist=handler(
    async(req, res, next)=>{
        let user=await User.findByIdAndUpdate(
            req.user._id,
            
            {$addToSet:{wishlist:req.body.product}}
            
            ,
            {new: true})
    res.status(200).json({data:user.wishlist,status:"success"});
        });

let removeProductfromWishlist=handler(
    async(req, res, next)=>{
        let user=await User.findByIdAndUpdate(
            req.user._id,
            {$pull:{wishlist:req.params.productId}}        
            ,{new: true})
        res.status(200).json({data:user.wishlist,status:"success"});
    });

let getLoggedUserWishlist=handler(
    async(req, res, next)=>{
        let user=await User.findById(req.user._id).populate('wishlist');
        res.status(200).json({data:user.wishlist,status:"success"});
});
module.exports={addProductToWishlist,removeProductfromWishlist,getLoggedUserWishlist};