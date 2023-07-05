
let express= require('express');
let router=express.Router();

let {login,signup,allowedTo,protect,resetPassword,vertifyPassword,forgetPassword}=require('../services/authServices')


let {loginValidator,signupValidator}=require('../validators/authValidator');


router.route('/login').post(loginValidator,login);
router.route('/signup').post(signupValidator,signup);
router.route('/forget-pass').post(forgetPassword);
router.route('/vertify-pass').post(vertifyPassword);
router.route('/reset-pass').post(resetPassword);

module.exports=router;