let validationMiddleware=require('../middlewares/validationMiddleware');
let {check}=require('express-validator')
let Category=require('../models/categoryModel')
let slugify=require('slugify');
let createSubcategoryValidator=[
    check('name').notEmpty().withMessage('name is required').
    isLength({min:6}).withMessage('name must be at least 6 characters')
    .isLength({max:20}).withMessage('name is too long').
    custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    check('category').notEmpty().withMessage('category is required').
    isMongoId().withMessage('invalid Id').
    custom((val)=>{
        Category.findById(val).then((category)=>{
            if(!category){
                return Promise.reject(new Error('no category found for Id'))
            };
        })
        // return true;
    })
    ,validationMiddleware
];

let getSubcategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validationMiddleware,
];

let updateSubcategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    check('name').optional()
    .custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    validationMiddleware,
];

let deleteSubcategoryValidator = [
    check('id').isMongoId().withMessage('Invalid Subcategory id format'),
    validationMiddleware,
];

module.exports =
{deleteSubcategoryValidator,createSubcategoryValidator,updateSubcategoryValidator,getSubcategoryValidator};