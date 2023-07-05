let handler=require('express-async-handler')
let apiError=require('../utils/apiError')
let apiFeatures=require('../utils/apiFeatures')
let getOne=(model)=> handler(async(req,res,next)=>{
    let id=req.params.id;
    let document=await model.findById(id);
    if(!document){
        return next(new apiError(`Couldn't find ${model} for ${id}`,400));
    }
    res.status(200).json({status:"success",result:document});
    });
let createOne=(model)=> handler(async(req,res,next)=>{
    let document=await model.create(req.body);
    if(!document){
        return next(new apiError(`Couldn't create ${model} `,400));
    };
    await document.save();
    res.status(200).json({status:"success",result:document}); 
    })
let updateOne=(model)=> handler(async(req,res,next)=>{
    let document=await model.findOneAndUpdate({_id:req.params.id},req.body,{new:true});
    if(!document){
        return next(new apiError(`Couldn't find ${model} for ${id}`,400));
    };
    await document.save();
    res.status(200).json({status:"success",result:document});
    });
let deleteOne=(model)=> handler(async(req,res,next)=>{
        let document=await model.findOneAndDelete(req.params.id);
        if(!document){
            return next(new apiError(`Couldn't find ${model} for ${id}`,400));
        };
        await document.remove();
        res.status(200).json({status:"success",result:`document deleted`});
        });
let getAll=(model,modelName=' ')=> handler(async(req,res,next)=>{
    let filter={};
    if(req.filter){
        filter=req.filter;
    };
    let numOfDocuments=await model.countDocuments();
    let Features=new apiFeatures(model.find({...filter}),req.query)
    .filter().limit()
    .search(modelName).sort().pagination(numOfDocuments);
    let {mongooseQuery}=Features;
    let documents=await mongooseQuery
    if(!documents){
        return next(new apiError('can not find documents for model ' ,400))
    }
    res.status(201).json({status: 'success',result:documents});
    });
module.exports={getAll,getOne,deleteOne,updateOne,createOne};