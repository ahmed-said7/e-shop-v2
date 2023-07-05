// let User=require('../models/userModel')
let {getAll,getOne,deleteOne,createOne}=require('../utils/handleFactor')
let User=require('../models/userModel')
let bcrybt=require('bcryptjs')
let handler=require('express-async-handler');
let jwt=require('jsonwebtoken');
let dotenv=require('dotenv');
dotenv.config({path:"./environment.env"});
const { response } = require('express');

let getUsers=getAll(User);

let deleteUser=deleteOne(User);
let getUser=getOne(User);
let createUser=createOne(User);

let updateUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate(req.params.id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        profileImg:req.body.profileImg,
    }
    ,{new:true})
    if(!user){
        return new Error('User not found')
    }
    res.status(200).json({updatedUser:user})
});

let changeUserPassword=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate(req.params.id,{
        password: await bcrybt.hash(req.body.password,12),
        passwordChangedAt: Date.now()
    }
    ,{new:true})
    if(!user){
        return new Error('User not found')
    }
    res.status(200).json({updatedUser:user})
});

let getLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findById(req.user._id)
    if(!user){
        return new Error('User not found')
    }
    res.status(200).json({User:user})
});

let updateLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate(req.user._id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        profileImg:req.body.profileImg,
    }
    ,{new:true})
    if(!user){
        return new Error('User not found')
    }
    res.status(200).json({updatedUser:user})
});

let changeLoggedUserPassword=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate(req.user._id,{
        password: await bcrybt.hash(req.body.password,12),
        passwordChangedAt: Date.now(),
    }
    ,{new:true})
    if(!user){
        return new Error('User not found')
    }
    let token=jwt.sign({userId:user._id},process.env.SECRET);
    res.status(200).json({updatedUser:user,token})
});

let deleteLoggedUser=handler(async(req,res,next)=>{
    let user=await User.findByIdAndUpdate(req.user._id,{
        active:false,
    }
    ,{new:true})
    if(!user){
        return new Error('User not found')
    }
    res.status(200).json({deletedUser:user})
});


module.exports={getUsers, updateUser, deleteUser, createUser ,getUser
    ,changeUserPassword,getLoggedUser,changeLoggedUserPassword,updateLoggedUser
    ,deleteLoggedUser
    };