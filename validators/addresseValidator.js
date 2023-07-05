let validationMiddleware=require('../middlewares/validationMiddleware');
let {check,body}=require('express-validator');
let Product=require('../models/productModel')


let removeAddresseValidator=[
    check('id').notEmpty().withMessage('productId is required')
    .isMongoId().withMessage('invalid format'),validationMiddleware
];

module.exports={removeAddresseValidator};