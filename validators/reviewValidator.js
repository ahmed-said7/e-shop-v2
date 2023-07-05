let validationMiddleware=require('../middlewares/validationMiddleware');
let {check}=require('express-validator');

let Review=require('../models/reviewModel');



let createReviewValidator=[
    check('rating').notEmpty().withMessage('rating is rquired')
        .isNumeric().withMessage('rating must be a number')
        .toFloat({min:1,max:5}).withMessage('rating must be between 1 and 5')
        ,check('user').notEmpty().withMessage('user is required').
        isMongoId().withMessage('invalid id format')
        ,check('product').notEmpty().withMessage('user is required').
        isMongoId().withMessage('invalid id format').custom(async(val,{req})=>{
            let review=await Review.find({product:req.body.product});
            
            if(review){
                reviewUserIds=review.map((ele)=>{return ele.user._id.toString();});
                console.log(reviewUserIds.includes(req.user._id.toString()));
                // console.log(reviewUserIds.includes(req.user._id.toString())
                // console.log(reviewUserIds.includes(req.user._id.toString())
                if(reviewUserIds.includes(req.user._id.toString())){
                    return Promise.reject(new Error('you have already reviewed'));
                };
            };
            
            
            return true;
        })
        ,
        validationMiddleware
];


let updateReviewValidator=[
    check('rating').optional()
        .isNumeric().withMessage('rating must be a number')
        .toFloat({min:1,max:5}).withMessage('rating must be between 1 and 5')
        ,
        check('id').
        isMongoId().withMessage('invalid id format')
        .custom(async(val,{req})=>{
            let review=await Review.findById(req.params.id);
            if(!review){
                return Promise.reject(new Error('can not find review'));
            };
            if(review.user._id.toString() !== req.user._id.toString()){
                return Promise.reject(new Error('you are not allowed'));
            };
            return true;
        })
        ,
        validationMiddleware
];


let deleteReviewValidator=[
    check('id').
        isMongoId().withMessage('invalid id format').custom(async(val,{req})=>{
            console.log(req.user)
            if(req.user.role==="user"){
                let review=await Review.findById(req.params.id);
                
                
                if(!review){
                    return Promise.reject(new Error('can not find review'));
                };
                

                if(review.user._id.toString() !== req.user._id.toString()){
                    return Promise.reject(new Error('you are not allowed'));
                };
                };
            return true;
            })
        ,
        validationMiddleware
];

let getReviewValidator=[
    check('id').
        isMongoId().withMessage('invalid id format')
    ,validationMiddleware
];


module.exports = {getReviewValidator,updateReviewValidator,deleteReviewValidator,createReviewValidator}