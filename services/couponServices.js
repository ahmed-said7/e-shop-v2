let Coupon=require('../models/couponModel')
let {getAll,getOne,deleteOne,updateOne,createOne}=require('../utils/handleFactor')
let getCoupons=getAll(Coupon);
let updateCoupon=updateOne(Coupon);
let deleteCoupon=deleteOne(Coupon);
let getCoupon=getOne(Coupon);
let createCoupon=createOne(Coupon);
module.exports={getCoupons, updateCoupon, deleteCoupon, createCoupon ,getCoupon};