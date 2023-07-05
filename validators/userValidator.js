let validationMiddleware=require('../middlewares/validationMiddleware');
let {check,body}=require('express-validator');
let User=require('../models/userModel');
let bcrybt=require('bcryptjs');
let slugify=require('slugify');

let createUserValidator=[
    check('name').notEmpty().withMessage('name is required').
    isLength({min:6}).withMessage('name must be at least 6 characters')
    .isLength({max:20}).withMessage('name is too long').
    custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),check('email').notEmpty().withMessage('email is required').custom((val)=>{
        User.findById({email:val}).then((user)=>{
            if(user){
                return Promise.reject(new Error('Email must be unique'));
            }
        })
        return true;
    }),check("password").notEmpty().withMessage('passwoed is required').
    isLength({min:6}).withMessage('password must be at least 6 characters').custom((val,{req})=>{
        if(val!==req.body.passwordConfirm){
            return new Error("passwordConfirm isn't correct");
        }
        return true;
    }),check('passwordConfirm').notEmpty().withMessage('password confirm is required'),
    check('phone').optional().isMobilePhone('ar-AE').withMessage('phone must be egyptian number'),
    validationMiddleware
];

let getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validationMiddleware
];

let updateUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    check('name').optional()
    .custom((val,{req})=>{
        req.body.slug=slugify(val);
        return true;
    }),
    check('email').notEmpty().withMessage('email is required').custom((val)=>{
        User.findById({email:val}).then((user)=>{
            if(user){
                return Promise.reject(new Error('Email must be unique'));
            }
        })
        return true;
        })
        ,
    validationMiddleware
];

let deleteUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validationMiddleware
];
let changePasswordValidator = [
    body('currentPassword').
    notEmpty().withMessage('currrent password is required').custom(async(val,{req})=>{
            let user=await User.findById(req.params.id)
            if(!user){
                return Promise.reject(new Error('no user found for Id'));
            }
            let correct=await bcrybt.compare(req.body.currentPassword,user.password);
            if(!correct){
                return Promise.reject(new Error('Current password is not correct '));
            };
            return true;
    }),
    body('password').notEmpty().withMessage('password is required').custom((val,{req})=>{
        if(val==!req.body.passwordConfirm){
            return new Error('confirm password is not correct');
        }
        return true;
    })
    ,body('passwordConfirm').notEmpty().withMessage('password Confirm is required')
    ,validationMiddleware]

let updateLoggedUserValidator = [
        check('id').isMongoId().withMessage('Invalid User id format'),
        check('name').optional()
        .custom((val,{req})=>{
            req.body.slug=slugify(val);
            return true;
        }),
        check('email').notEmpty().withMessage('email is required').custom((val)=>{
            User.findById({email:val}).then((user)=>{
                if(user){
                    return Promise.reject(new Error('Email must be unique'));
                }
            })
            return true;
            })
            ,
        validationMiddleware
    ];

let changeLoggedUserPasswordValidator = [
        check('currentPassword').
        notEmpty().withMessage('currrent password is required').custom(async(val,{req})=>{
                // console.log(req.user);
                let currentUser=req.user;
                let correct=await bcrybt.compare(req.body.currentPassword,currentUser.password);
                if(!correct){
                    return Promise.reject(new Error('Current password is not correct '));
                };
                return true;
        }),
        check('password').notEmpty().withMessage('password is required').custom((val,{req})=>{
            if(val==!req.body.passwordConfirm){
                return new Error('confirm password is not correct');
            }
            return true;
        })
        ,check('passwordConfirm').notEmpty().withMessage('password Confirm is required')
        ,validationMiddleware]
module.exports =
    {updateUserValidator,updateLoggedUserValidator,deleteUserValidator
        ,createUserValidator,getUserValidator,changePasswordValidator,changeLoggedUserPasswordValidator};
