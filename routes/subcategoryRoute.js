let express= require('express');
let router=express.Router();

let {allowedTo,protect}=require('../services/authServices')

let {deleteSubcategoryValidator,createSubcategoryValidator,updateSubcategoryValidator
    ,getSubcategoryValidator}=require('../validators/subcategoryValidator')

let {getSubcategories, updateSubcategory, deleteSubcategory, createSubcategory ,getSubcategory}
    =require('../services/subcategoryServices');

router.route('/').get(protect,allowedTo("user","admin"),getSubcategories)
    .post(protect,allowedTo('admin','user'),createSubcategoryValidator,createSubcategory);
router.route('/:id').get(getSubcategoryValidator,getSubcategory).
        delete(protect,allowedTo("user","admin"),deleteSubcategoryValidator,deleteSubcategory)
        .put(protect,allowedTo("user","admin"),updateSubcategoryValidator,updateSubcategory);
module.exports=router;