let express= require('express');

let router=express.Router({mergeParams:true});

let {allowedTo,protect}=require('../services/authServices')


let {getReviewValidator,updateReviewValidator,deleteReviewValidator,
    createReviewValidator}=require('../validators/reviewValidator');

let {getReviews, updateReview, deleteReview, createReview ,getReview ,setFilterObject,
    setUserAndProductToBody}
    =require('../services/reviewServices');

router.route('/').
    get(protect,allowedTo("user","admin"),setFilterObject,getReviews).
    post(protect,allowedTo("admin","user"),
    setUserAndProductToBody,createReviewValidator,createReview);



router.route('/:id').
    get(protect,allowedTo("user","admin"),getReviewValidator,getReview)
    .delete(protect,allowedTo("admin","user"),deleteReviewValidator,deleteReview)
    .put(protect,allowedTo("admin","user"),updateReviewValidator,updateReview);


module.exports = router;