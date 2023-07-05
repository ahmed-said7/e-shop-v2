let express= require('express');
let router=express.Router();



let {allowedTo,protect}=require('../services/authServices')
let {checkoutSession}=require('../services/orderServices');

let {createOrder,
    updateOrderDelivered,updateOrderPaid,getSpecificOrder,getLoggedUserOrder
}=require('../services/orderServices');

router.route('/checkout-session/:id').post(protect,allowedTo("admin","user"),checkoutSession);
router.route('/').get(protect,allowedTo("admin","user"),getLoggedUserOrder);
router.route('/:id').
    post(protect,allowedTo("admin","user"),createOrder);
router.route('/:id').
    get(protect,allowedTo("user","admin"),getSpecificOrder);

router.route('/:id/delivered').put(protect,allowedTo("user","admin"),updateOrderDelivered)
router.route('/:id/paid').put(protect,allowedTo("user","admin"),updateOrderPaid)

module.exports=router;