let express= require('express');
let router=express.Router();

let {allowedTo,protect}=require('../services/authServices')

let {deleteProductValidator,createProductValidator,updateProductValidator,
    getProductValidator}=require('../validators/productValidator');

let {getProducts, updateProduct, deleteProduct, createProduct ,getProduct }
    =require('../services/productServices');
    
    let reviewRouter=require('../routes/reviewRoute')
    
    router.use('/:productId/reviews',reviewRouter)
    

    router.route('/').
    get(protect,allowedTo("user","admin"),getProducts).
    post(protect,allowedTo("admin","user"),createProductValidator,createProduct);
    
    router.route('/:id').
    get(protect,allowedTo("user","admin"),getProductValidator,getProduct).
    delete(protect,allowedTo("admin"),deleteProductValidator,deleteProduct).
    put(protect,allowedTo("admin"),updateProductValidator,updateProduct)


    module.exports=router;