const mongoose = require('mongoose');
const brandSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: [true, 'Brand required'],
        unique: [true, 'Brand must be unique'],
        minlength: [3, 'Too short Brand name'],
        maxlength: [32, 'Too long Brand name'],
    },
    slug: {
        type: String,
        lowercase: true,
    },
    image: String,
} , { timestamps: true }
);

// 2- Create model

let brandModel = mongoose.model('Brand', brandSchema);
module.exports=brandModel;