let validationMiddleware=require('../middlewares/validationMiddleware');
let {check}=require('express-validator')
let slugify=require('slugify');
let createBrandValidator=[
    check('name').notEmpty().withMessage('name is required').
    isLength({min:6}).withMessage('name must be at least 6 characters')
    .isLength({max:20}).withMessage('name is too long').
    custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),validationMiddleware
];

let getBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validationMiddleware,
];

let updateBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    check('name').optional()
    .custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    validationMiddleware,
];

let deleteBrandValidator = [
    check('id').isMongoId().withMessage('Invalid Brand id format'),
    validationMiddleware,
];

module.exports =
{deleteBrandValidator,createBrandValidator,updateBrandValidator,getBrandValidator};