let express= require('express');
let router=express.Router();
let {allowedTo,protect}=require('../services/authServices')
let {addProductToWishlist,removeProductfromWishlist,getLoggedUserWishlist}
=require('../services/wishlistServices')

let {addWishlistValidator,removeWishlistValidator}=require('../validators/wishlistValidator');

router.route('/').
    get(protect,allowedTo("user","admin"),getLoggedUserWishlist).
    post(protect,allowedTo("admin","user"),addWishlistValidator,addProductToWishlist);



router.route('/:productId').
    delete(protect,allowedTo("admin","user"),removeWishlistValidator,removeProductfromWishlist)
    
module.exports = router;

