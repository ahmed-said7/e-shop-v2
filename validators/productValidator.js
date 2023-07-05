let validationMiddleware=require('../middlewares/validationMiddleware');
let {check}=require('express-validator')
let slugify=require('slugify');
let Category=require('../models/categoryModel');
let Subcategory=require('../models/subcategoryModel');
let createProductValidator=[
    check('title').notEmpty().withMessage('name is required').
    isLength({min:6}).withMessage('name must be at least 6 characters')
    .isLength({max:100}).withMessage('name is too long').
    custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),check('description').notEmpty().withMessage('description is required').
    isLength({min:20}).withMessage('description is too short'),
    check('quantity').notEmpty().withMessage('quantity is required'),
    check('sold').optional().isNumeric().withMessage('quantity must be a number'),
    check('price').notEmpty().withMessage('price is required'),
    check('priceAfterDiscount').optional().isNumeric().withMessage('price must be a number').
    custom((val,{req})=>{
        if(req.body.price<val){
            return new Error('price must be lower than discount');
        };
        return true;
    }),check('colors').optional().isArray().withMessage('colors must be an array'),
    check('imageCover').notEmpty().withMessage('image cover is required'),
    check('category').notEmpty().withMessage('category is required').
    isMongoId().withMessage('category must be valid Id').
    custom((val)=>{
        Category.findById(val).then((category)=>{
            if(!category){
                return Promise.reject(new Error('Cannot find category'));
            }
        })
        return true;
    }),
    check('subcategories').optional().isMongoId().withMessage('subcategory must be valid Id')
    .custom((val)=>{
        Subcategory.find({_id:{$in:val}}).then((subcategories)=>{
            if(subcategories.length ==! val.length){
                return Promise.reject(new Error('Subcategory Ids not found'));
            }
        })
        return true;
        }).custom((val,{req})=>{
            Subcategory.find({category:req.body.category}).then((subcategories)=>{
                let subcategories_ids=subcategories.map((ele)=>{
                    return ele._id
                })
                let correct=val.every((ele)=>{
                    return subcategories_ids.includes(ele)
                })
                if(!correct){
                    return Promise.reject(new Error('subcategories not belongs to category'));
                }
            })
        return true;
    }),check('ratingsAverage').optional().isNumeric('ratingsAverage must be a number')
    .isLength({min:1}).withMessage('ratingsAverage is too short').
    isLength({max:20}).withMessage('ratingsAverage is too long'),
    check('ratingsQuantity').optional().isNumeric().
    withMessage('ratingsQuantity must be a number')
    ,validationMiddleware
];

let getProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validationMiddleware,
];

let updateProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    check('title').optional()
    .custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    validationMiddleware,
];

let deleteProductValidator = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validationMiddleware,
];

module.exports =
{deleteProductValidator,createProductValidator,updateProductValidator,getProductValidator};