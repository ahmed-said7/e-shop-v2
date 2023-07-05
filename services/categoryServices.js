
let categoryModel=require('../models/categoryModel')
let {getAll,getOne,deleteOne,updateOne,createOne}=require('../utils/handleFactor')



let getCategories=getAll(categoryModel);
let updateCategory=updateOne(categoryModel);
let deleteCategory=deleteOne(categoryModel);
let getCategory=getOne(categoryModel);
let createCategory=createOne(categoryModel);


module.exports={getCategories, updateCategory, deleteCategory, createCategory ,getCategory};