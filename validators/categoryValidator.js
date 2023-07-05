let validationMiddleware=require('../middlewares/validationMiddleware');
let {check}=require('express-validator')
let slugify=require('slugify');
let createCategoryValidator=[
    check('name').notEmpty().withMessage('name is required').
    isLength({min:6}).withMessage('name must be at least 6 characters')
    .isLength({max:20}).withMessage('name is too long').
    custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),validationMiddleware
];

let getCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validationMiddleware,
];

let updateCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    check('name').optional()
    .custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    validationMiddleware,
];

let deleteCategoryValidator = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validationMiddleware,
];

module.exports =
{deleteCategoryValidator,createCategoryValidator,updateCategoryValidator,getCategoryValidator};