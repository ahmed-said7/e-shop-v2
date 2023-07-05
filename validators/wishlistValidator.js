let validationMiddleware=require('../middlewares/validationMiddleware');
let {check,body}=require('express-validator');
let Product=require('../models/productModel')

let addWishlistValidator=[
    check('product').notEmpty().withMessage('product is required').custom((val,req)=>{
        Product.findById(val).then((product)=>{
            if(!product){
                return Promise.reject(new Error('Product not found'));
            };
        return true;
        });
    })
    ,
    validationMiddleware
];
let removeWishlistValidator=[
    check('productId').notEmpty().withMessage('productId is required')
    .isMongoId().withMessage('invalid format'),validationMiddleware
];
module.exports ={addWishlistValidator,removeWishlistValidator};