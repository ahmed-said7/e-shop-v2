let crypto = require('crypto');
// let transport=require('../utils/sendEmail')
let User=require('../models/userModel')
let bcrybt=require('bcryptjs')
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
let jwt=require('jsonwebtoken');
let dotenv = require('dotenv');
const { options } = require('../routes/categoryRoute');
const sendMail = require('../utils/sendEmail');
// const { response } = require('express');
dotenv.config({path:"./environment.env"});
let login=handler(
    async(req,res,next)=>{
        let user=await User.findOne({email:req.body.email});
        if(!user){
            return next(new apiError('no user found for this email',400));
        }
        
        // let correct=await bcrybt.compare(req.body.password,user.password);
        if(! await bcrybt.compare(req.body.password,user.password)){
            return next(new apiError('email or password is not correct',400));
        }
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"20d"});
        res.status(200).json({token,User:user});
    }
)

let signup=handler(
    async(req,res,next)=>{
        let user=await User.create({
            email:req.body.email,
            name:req.body.name,
            password:req.body.password
        });
        if(!user){
            return next(new apiError('no user found for this email',400));
        }
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"20d"});
        res.status(200).json({token,User:user});
    }
)

let protect=handler(
    async(req,res,next)=>{
        let token;
        if(req.headers.authorization){
            token=req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return next(new apiError("no token found",400))
        };
        let decoded=jwt.verify(token,process.env.SECRET);
        let currentUser=await User.findById(decoded.userId);
        if(!currentUser){
            return next(new apiError("no user found",400))
        }
        if(currentUser.passwordChangedAt){
            let stamp=Math.floor(currentUser.passwordChangedAt/1000);
            if(stamp>decoded.iat){
                return next(new apiError("user password changed",400))
            }
        }
        req.user=currentUser;
        next();
    }
)

let allowedTo=(...roles)=> handler(async (req, res, next)=>{
        if(!roles.includes(req.user.role)){
            return next(new apiError("you are  not allowed to access this route"),400)
        }
        next();
});

let forgetPassword=handler(
    async(req,res,next)=>{
        let user=await User.find({email:req.body.email})
        if(!user){
            return next(new apiError("no user for this email"),400);
        }
        console.log(user);
        let resetCode=`${Math.floor(100000 + Math.random() * 900000)}`;
        user.passwordResetCode=crypto.createHash('sha256').update(resetCode).digest('hex');
        user.passwordResetExpires=Date.now()+20*60*1000;
        user.passwordResetVertified=false;
        await user.save()
        let options={
            email: user.email,
            subject:"change password",
            message:`hi me ${user.name} your vertification code is ${resetCode}`,
        }
        // console.log(resetCode)
        try{
            await sendMail(options);
        }catch(err){
            console.error(err);
            user.passwordResetCode=undefined;
            user.passwordResetExpires=undefined;
            user.passwordResetVertified=undefined;
            await user.save();
            return next(new apiError('error in sending message'),400);
        };
        res.status(200).json({message:"sending code success"})
    })

let vertifyPassword=handler(
    async(req,res,next)=>{
        let resetCode=req.params.resetCode
        let user=await User.find({
                passwordResetCode: crypto.createHash('sha256').update(resetCode).digest('hex'),
                passwordResetExpires:{$gte:Date.now()}
        })
        if(!user){
            return next(new apiError('reset code is invalid'),400);
        }
        user.passwordResetVertified=true;
        await user.save();
        res.status(200).json({message:"vertification successful"})
    }
)

let resetPassword=handler(
    async(req,res,next) => {
        let user=await User.find({email:req.body.email});
        if(!user){
            return next(new apiError("no user for this email"),400);
        }
        user.password=await bcrybt.hash(req.body.password,12);
        await user.save();
        let token=jwt.sign({userId:user._id},process.env.SECRET,{expiresIn:"40d"});
        res.status(200).send({token,data:user});
    }
)


module.exports ={login,signup,allowedTo,protect,resetPassword,vertifyPassword,forgetPassword};