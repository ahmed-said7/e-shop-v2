let Subcategory=require('../models/subcategoryModel')

let {getAll,getOne,deleteOne,updateOne,createOne}=require('../utils/handleFactor')
let getSubcategories=getAll(Subcategory);
let updateSubcategory=updateOne(Subcategory);
let deleteSubcategory=deleteOne(Subcategory);
let getSubcategory=getOne(Subcategory);
let createSubcategory=createOne(Subcategory);
module.exports={getSubcategories, updateSubcategory, deleteSubcategory, createSubcategory ,getSubcategory};