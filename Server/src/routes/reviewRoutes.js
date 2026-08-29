import express from "express";
import {createReview,getAllReviews,getMyReviews,getReviewById,updateReview,deleteReview}from "../controller/reviewController.js";

const router=express.Router();

router.post("/create-review",createReview);
router.get("/get-all-reviews/:productId",getAllReviews);
router.get("/get-review/:reviewId",getReviewById);
router.get("/get-my-reviews/:userId",getMyReviews);

router.put("/update-review/:reviewId",updateReview);
router.delete("/delete-review/:reviewId",deleteReview); 

export default router;