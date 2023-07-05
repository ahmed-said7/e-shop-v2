let validationMiddleware=require('../middlewares/validationMiddleware');
let {check}=require('express-validator')
// let slugify=require('slugify');
let createCartValidator=[
    check('color').notEmpty().withMessage('color is required'),
    check('productId').notEmpty().withMessage('productId is required')
    .isMongoId().withMessage('invalid format'),
    validationMiddleware
];

let applyCouponValidator = [
    check("id").isMongoId().withMessage('Invalid Cart id format'),
    check("name").notEmpty().withMessage('coupon name is required')
    ,validationMiddleware
];

let updateCartValidator = [
    check("id").isMongoId().withMessage('Invalid Cart id format'),
    check('name').optional()
    ,
    validationMiddleware,
];

let deleteCartItemValidator = [
    check("id").isMongoId().withMessage('Invalid Cart id format'),
    validationMiddleware,
];

module.exports={deleteCartItemValidator,updateCartValidator,applyCouponValidator,createCartValidator};