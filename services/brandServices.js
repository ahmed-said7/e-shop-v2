let Brand=require('../models/brandModel')
let {getAll,getOne,deleteOne,updateOne,createOne}=require('../utils/handleFactor')
let getBrands=getAll(Brand);
let updateBrand=updateOne(Brand);
let deleteBrand=deleteOne(Brand);
let getBrand=getOne(Brand);
let createBrand=createOne(Brand);
module.exports={getBrands, updateBrand, deleteBrand, createBrand ,getBrand};