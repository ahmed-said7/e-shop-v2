let {validationResult}=require('express-validator')
let validationMiddleware = (req,res,next)=>{
    let errors=validationResult(req);
    console.log(errors);
    if(!errors.isEmpty()){
        return res.status(400).json({status:"fail",error:errors.array()});
    }
    next();
}
module.exports=validationMiddleware;