let express= require('express');
let router=express.Router();
let {allowedTo,protect}=require('../services/authServices')


let { getLoggedUserAddresses, addUserAddresse, removeAddressfromUser } =
    require('../services/addresseServices');

let {removeAddresseValidator}=require('../validators/addresseValidator');

router.route('/').
    get(protect,allowedTo("user","admin"),getLoggedUserAddresses).
    post(protect,allowedTo("admin","user"),addUserAddresse);



router.route('/:id').
    delete(protect,allowedTo("admin","user"),removeAddresseValidator,removeAddressfromUser)



module.exports = router;