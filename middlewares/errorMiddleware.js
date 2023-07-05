let globalError=(err,req,res,next)=>{
    console.error(err);
    res.status(err.statusCode).json({
        message: err.message,
        error:err,
        status:err.status,
        status:"failed",
    })

}
module.exports =globalError;