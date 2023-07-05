let express= require('express');
let router=express.Router();

let {allowedTo,protect}=require('../services/authServices')



let{updateUserValidator,updateLoggedUserValidator,deleteUserValidator
    ,createUserValidator,getUserValidator,changePasswordValidator
    ,changeLoggedUserPasswordValidator}
    =require('../validators/userValidator');

let {getUsers, updateUser, deleteUser, createUser ,getUser
    ,changeUserPassword,getLoggedUser,changeLoggedUserPassword,updateLoggedUser
    ,deleteLoggedUser
    }=require('../services/userServices');

router.route("/getme").
    get(protect,allowedTo('user',"admin"),getLoggedUser)
router.route("/deleteme").
    delete(protect,allowedTo('user',"admin"),deleteLoggedUser)
router.route("/updateme").
    put(protect,allowedTo('user',"admin"),updateLoggedUserValidator,updateLoggedUser)
router.route('/change-my-password').
    put(protect,allowedTo('user',"admin"),changeLoggedUserPasswordValidator,changeLoggedUserPassword)



router.route('/').get(protect,allowedTo('admin'),getUsers)
    .post(createUserValidator,createUser);

router.route('/:id').get(protect,allowedTo('admin'),getUserValidator,getUser)
    .put(protect,allowedTo('admin'),updateUserValidator,updateUser)
    .delete(protect,allowedTo('admin'),deleteUserValidator,deleteUser)

router.route('/:id/change-password').
        put(protect,allowedTo('admin'),changePasswordValidator,changeUserPassword)


module.exports=router;