let express= require('express');
let router=express.Router();

let {deleteBrandValidator,createBrandValidator,updateBrandValidator
    ,getBrandValidator}=require('../validators/brandValidator')

let {allowedTo,protect}=require('../services/authServices')


let {getBrands, updateBrand, deleteBrand, createBrand ,getBrand}
    =require('../services/brandServices');


router.route('/')
    .get(protect,allowedTo("user","admin"),getBrands).post(protect,allowedTo("admin"),createBrandValidator,createBrand);
router.route('/:id').
    get(protect,allowedTo("user","admin"),getBrandValidator,getBrand).
    delete(protect,allowedTo("admin"),deleteBrandValidator,deleteBrand).
    put(protect,allowedTo("admin"),updateBrandValidator,updateBrand);

module.exports=router;