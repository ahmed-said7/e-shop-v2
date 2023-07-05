let mongoose= require('mongoose');
let catgorySchema=new mongoose.Schema({
    name: {
        type:String,
        required:true,
        minlength:[6,'category name is too short'],
        maxlength:[20,'category name is too long'],
        trim:true,
    },
    images:[String],
    imageCover:String,
    slug:{
        type:String,
        lowercase:true,
    }
},{timestamps:true});
let categoryModel=mongoose.model('Category',catgorySchema);
// categoryModel.countDocuments
module.exports=categoryModel;