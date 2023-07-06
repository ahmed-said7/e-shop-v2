let Order=require('../models/orderModel');
let Cart=require('../models/cartModel');
let Product=require('../models/productModel');
let {getAll,getOne,deleteOne,updateOne,createOne}=require('../utils/handleFactor');
let dotenv=require('dotenv');
dotenv.config({path:"./environment.env"});
// console.log(process.env.STRIPE_SECRET);

let stripe=require('stripe')(process.env.STRIPE_SECRET);
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
const { request } = require('http');
const User = require('../models/userModel');
let createOrder=handler(async (req,res,next)=>{
    let taxPrice=5;
    let shippingPrice=20;
    let cart= await Cart.findById(req.params.id);
    if(!cart){
        return new apiError('there is no cart with id ' ,400)
    };
    let order=await Order.create({
        cartItems: cart.cartItems,
        user:req.user._id,
        shippingAddress:req.body.shippingAddress
    });
    if(cart.totalPriceAfterDiscount){
        order.totalPrice=cart.totalPriceAfterDiscount+taxPrice+shippingPrice;
    }else{
        order.totalPrice=cart.totalPrice+taxPrice+shippingPrice;
    };
    await order.save();
    let products=cart.cartItems.map(async(item)=>{
        return await Product.findByIdAndUpdate(item.product,
            {$inc:{quantity:-item.quantity,sold:item.quantity}},{new:true});
    });
    console.log(products);
    await Promise.all(products);
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json({result:"success",data:order});
});

let getLoggedUserOrder=handler(async(req,res,next)=>{
    let order=await Order.findOne({user:req.user._id});
    if(!order){
        return next(new apiError("Order not found",400))
    };
    res.status(200).json({result:"success",data:order});
});

let getSpecificOrder=handler(async(req,res,next)=>{
    let order=await Order.findById(req.params.id);
    if(!order){
        return next(new apiError("Order not found",400))
    };
    res.status(200).json({result:"success",data:order});
});

let updateOrderPaid=handler(async(req,res,next)=>{
    let order=await Order.findByIdAndUpdate(req.params.id,{
        ispaid:true,
        paidAt:Date.now()
    },{new:true});
    if(!order){
        return next(new apiError("Order not found",400))
    };
    res.status(200).json({result:"success",data:order});
});

let updateOrderDelivered=handler(async(req,res,next)=>{
    let order=await Order.findByIdAndUpdate(req.params.id,{
        isdelivered:true,
        deliveredAt:Date.now()
    },{new:true});
    if(!order){
        return next(new apiError("Order not found",400));
    };
    res.status(200).json({result:"success",data:order});
});

let checkoutSession=handler(async(req, res, next)=>{
    let cart=await Cart.findById(req.params.id);
    let taxPrice=10;
    let shippingPrice=15;
    if(!cart){
        return next(new apiError("Cart not found",400));
    };
    let totalPrice= cart.totalPriceAfterDiscount ? cart.totalPriceAfterDiscount : cart.totalPrice;
    totalPrice += taxPrice+shippingPrice;
    let session=await stripe.checkout.sessions.create({
        line_items:[
            {
                price_data:
                {
                currency:"egp" , unit_amount:totalPrice*100,
                product_data:{name:req.user.name}
                },
                quantity:1,
            },
        ],
        mode:"payment",
        success_url:`${req.protocol}://${req.get('host')}/order`,
        cancel_url:`${req.protocol}://${req.get('host')}/cart`,
        client_reference_id:req.params.id,
        customer_email:req.user.email
    });
    res.status(200).json({status:"success",data:session});

});

let createCardOrder=async(event)=>{
    let session=event.data.object;
    let cartId=session.client_reference_id;
    let userEmail=session.customer_email;
    console.log(cartId);
    console.log(userEmail);
    let user=await User.findOne({email:userEmail});
    let cart= await Cart.findById(cartId);
    let order=await Order.create({
        cartItems:cart.cartItems,
        user:user._id,
        ispaid:true,
        paidAt:Date.now()
    });

    if(cart.totalPriceAfterDiscount){
        order.totalPrice=cart.totalPriceAfterDiscount;
    }else{
        order.totalPrice=cart.totalPrice;
    };

    await order.save();


    let products=cart.cartItems.map(async(item)=>{
        return await Product.findByIdAndUpdate(item.product,
            {$inc:{quantity:-item.quantity,sold:item.quantity}},{new:true});
    });
    console.log(order);
    await Promise.all(products);
    // await Cart.findByIdAndDelete(req.params.id);
    return order;
};

let webhookCheckout=handler(async(req,res,next)=>{
    let sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig,process.env.WEBHOOK_SECRET);
    } catch (err) {
        console.log(err);
        return res.status(400).send(`Webhook Error: ${err.message}`);
        
    };
    if(event.type === "checkout.session.completed"){
        console.log(event.data.object,event.type);
        let order=await createCardOrder(event);
        res.status(200).json({status:"success",data:order});
    };
});

module.exports=
{createOrder,updateOrderDelivered,updateOrderPaid,
    getSpecificOrder,getLoggedUserOrder,checkoutSession,webhookCheckout};