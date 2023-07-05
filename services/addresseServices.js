let User=require('../models/userModel');
let Addresse=require('../models/addresseModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');

let addUserAddresse=handler(
    async(req, res, next)=>{
        let addresse=await Addresse.create(req.body);
        let user=await User.findByIdAndUpdate(
            req.user._id,
            {$addToSet:{addresses:addresse._id.toString()}}
            ,
            {new: true})
        console.log(user,addresse);
    res.status(200).json({data:user.addresses,status:"success"});
        });
let removeAddressfromUser=handler(
    async(req, res, next)=>{
        await Addresse.findByIdAndDelete(req.params.id);
        let user=await User.findByIdAndUpdate(
            req.user._id,
            {$pull:{addresses:req.params.id}}        
            ,{new: true})
        res.status(200).json({data:user.wishlist,status:"success"});
    });

let getLoggedUserAddresses=handler(
    async(req, res, next)=>{
        let user=await User.findById(req.user._id).populate('addresses');
        res.status(200).json({data:user.addresses,status:"success"});
});
module.exports={addUserAddresse,removeAddressfromUser,getLoggedUserAddresses};