let express= require('express');
let router=express.Router();

// let {deleteBrandValidator,createBrandValidator,updateBrandValidator
//     ,getBrandValidator}=require('../validators/brandValidator')

let {allowedTo,protect}=require('../services/authServices')
let {deleteCouponValidator,createCouponValidator,updateCouponValidator,getCouponValidator}=
require('../validators/couponValidator')

let {getCoupons, updateCoupon, deleteCoupon, createCoupon ,getCoupon}
    =require('../services/couponServices');


router.route('/')
    .get(protect,allowedTo("user","admin"),getCoupons).
    post(protect,allowedTo("admin","user"),createCouponValidator,createCoupon);
router.route('/:id').
    get(protect,allowedTo("user","admin"),getCouponValidator,getCoupon).
    delete(protect,allowedTo("admin"),deleteCouponValidator,deleteCoupon).
    put(protect,allowedTo("admin"),updateCouponValidator,updateCoupon);

module.exports=router;