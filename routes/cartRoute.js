


let {applyCoupon,clearCart,addProductToCart,
    updateProductCart,deleteProductCart,getLoggedUserCart}=require('../services/cartServices');

let express= require('express');
let router=express.Router();


let{createCartValidator}=require('../validators/cartValidator');
// console.log(createCartValidator);
let {deleteCartItemValidator,updateCartValidator,applyCouponValidator}=
require('../validators/cartValidator')
let {allowedTo,protect}=require('../services/authServices');


router.route('/apply-coupon').put(protect,allowedTo("user","admin"),applyCouponValidator,applyCoupon)

router.route('/')
    .get(protect,allowedTo("user","admin"),getLoggedUserCart)
    // createCartValidator
    .post(protect,allowedTo("admin","user"),createCartValidator,addProductToCart).
    delete(protect,allowedTo("admin","user"),clearCart);
router.route('/:id').
    delete(protect,allowedTo("admin","user"),deleteCartItemValidator,deleteProductCart).
    put(protect,allowedTo("admin","user"),updateCartValidator,updateProductCart);

module.exports=router;