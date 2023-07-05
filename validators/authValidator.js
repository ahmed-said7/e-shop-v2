let validationMiddleware=require('../middlewares/validationMiddleware');
let {check,body}=require('express-validator');
let User=require('../models/userModel');
let bcrybt=require('bcryptjs');
let slugify=require('slugify');

let loginValidator=[
    check('email').notEmpty().withMessage('email is required').custom((val)=>{
        User.findById({email:val}).then((user)=>{
            if(!user){
                return Promise.reject(new Error('Email not found'));
            }
        })
        return true;
    }),check("password").notEmpty().withMessage('passwoed is required'),
    validationMiddleware
];

let signupValidator=[
    check('name').notEmpty().withMessage('name is required').
    isLength({min:6}).withMessage('name must be at least 6 characters')
    .isLength({max:20}).withMessage('name is too long').
    custom((val,{req})=>{
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
    }),
    check("password").notEmpty().withMessage('passwoed is required').
    isLength({min:6}).withMessage('password must be at least 6 characters').custom((val,{req})=>{
        if(val!==req.body.passwordConfirm){
            return new Error("passwordConfirm isn't correct");
        }
        return true;
    }),
    check('passwordConfirm').notEmpty().withMessage('password confirm is required'),
    validationMiddleware
];
module.exports={loginValidator,signupValidator};