// const { response } = require('express');
let Cart=require('../models/cartModel');
let Product=require('../models/productModel');
let handler=require('express-async-handler');
const apiError = require('../utils/apiError');
const couponModel = require('../models/couponModel');

let calcTotalPrice=(cart)=>{
    let totalPrice=0;
    cart.cartItems.forEach((Item)=>{
        totalPrice += Item.quantity*Item.price;
    });
    return totalPrice;
};

let addProductToCart=handler(
    async(req,res,next)=>{
        let {color,productId}=req.body;
        let product=await Product.findById(productId);
        let cart = await Cart.findOne({ user: req.user._id });;
        console.log(cart);
        if(!cart){
            await Cart.create({user:req.user._id,
            cartItems:[{
                color,
                product:productId,
                price:product.price
                }
            ],totalPrice:product.price
            });
        }else{
            let index=cart.cartItems.findIndex((item)=>{
                return item.product.toString()=== productId && item.color===color
            });
            if(index>-1){
                cart.cartItems[index].quantity +=1;
            }else{
                cart.cartItems.push({ color, product:productId, price:product.price });
            };
            cart.totalPrice=calcTotalPrice(cart);
            };
        await cart.save();
        res.status(200).json({status:"success",
        result:cart.cartItems,
        totalPrice:cart.totalPrice,
        priceAfterDiscount:cart.totalPriceAfterDiscount
        });
    }
);

let getLoggedUserCart=handler(
    async(req,res,next)=>{
        console.log(req.user._id)
        let cart=await Cart.findOne({user:req.user._id});
        if(!cart){
            return next(new apiError('Cart not found',400));
        }
        res.status(200).json({status:"success",
        result:cart,
        totalPrice:cart.totalPrice,
        priceAfterDiscount:cart.totalPriceAfterDiscount
        });
    }
);

let updateProductCart=handler(async(req,res,next)=>{
    let {quantity}=req.body;
    let cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return new apiError('no cart found for user',400);
    };
    let index=cart.cartItems.findIndex((ele)=>{
        return ele._id.toString() === req.params.id;
    });
    if(index>-1){
        cart.cartItems[index].quantity=quantity;
    }
        cart.totalPrice=calcTotalPrice(cart);
        await cart.save();
        res.status(200).json({status:"success",
        result:cart.cartItems,
        totalPrice:cart.totalPrice,
        priceAfterDiscount:cart.totalPriceAfterDiscount
        });

});
let clearCart=handler(async(req,res,next)=>{
    let cart=await Cart.findOneAndDelete({user:req.user._id});
    if(!cart){
        return new apiError('Cart not found',400)
    };
    res.status(200).json({status:"success"});
});
let deleteProductCart=handler(async(req,res,next)=>{
    let cart=await Cart.findOne({user:req.user._id});
    if(!cart){
        return new apiError('no cart found for user',400);
    };
    let index=cart.cartItems.findIndex((ele)=>{
        return ele._id.toString() === req.params.id;
    });
    if(index>-1){
        let cart=await Cart.findOneAndUpdate({user:req.user._id},{$pull:{cartItems:cartItems[index]}},{new:true});
        cart.totalPrice=calcTotalPrice(cart);
        await cart.save();
        res.status(200).json({status:"success",
        result:cart.cartItems,
        totalPrice:cart.totalPrice,
        priceAfterDiscount:cart.totalPriceAfterDiscount
        });
    };
});



let applyCoupon=handler(
    async(req,res,next)=>{
        let {name}=req.body;
        let coupon=await couponModel.findOne({name,expired:{$gt:Date.now()}});
        if(!coupon){
            return new apiError('no coupon found',400);
        };
        let cart=await Cart.findOne({user:req.user._id});
        let priceAfterDiscount=cart.totalPrice-(cart.totalPrice*coupon.discount)/100;
        cart.totalPriceAfterDiscount=priceAfterDiscount;
        res.status(200).json({status:"success",
        result:cart.cartItems,
        totalPrice:cart.totalPrice,
        priceAfterDiscount:cart.totalPriceAfterDiscount
        });
    }
);

module.exports={applyCoupon,clearCart,addProductToCart,
    updateProductCart,deleteProductCart,getLoggedUserCart};

