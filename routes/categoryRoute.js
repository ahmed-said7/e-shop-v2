let express= require('express');
let router=express.Router();
let {allowedTo,protect}=require('../services/authServices')


let {deleteCategoryValidator,createCategoryValidator,updateCategoryValidator,
    getCategoryValidator}=require('../validators/categoryValidator');

let {getCategories, updateCategory, deleteCategory, createCategory ,getCategory}
    =require('../services/categoryServices');

router.route('/').
    get(protect,allowedTo("user","admin"),getCategories).
    post(protect,allowedTo("admin"),createCategoryValidator,createCategory);



router.route('/:id').
    get(protect,allowedTo("user","admin"),getCategoryValidator,getCategory)
    .delete(protect,allowedTo("admin"),deleteCategoryValidator,deleteCategory)
    .put(protect,allowedTo("admin"),updateCategoryValidator,updateCategory);
module.exports = router;