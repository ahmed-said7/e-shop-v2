let mongoose= require('mongoose');
let catgorySchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:[6,'category name is too short'],
        maxlength:[20,'category name is too long'],
        trim:true,
    },
    slug:{
        type:String,
        lowercase:true,
    },
    category:{
        type:mongoose.Schema.ObjectId,
        ref:'Category',
    }
},{timestamps:true});
let subcategoryModel=mongoose.model('subCategory',catgorySchema);
module.exports=subcategoryModel;