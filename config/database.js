let mongoose= require('mongoose');
exports.databaseConnect=(url)=>{
    mongoose.connect(url).then(()=>{
        console.log('connection established')
    });
};