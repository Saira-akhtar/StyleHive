import express from "express";
import {createCoupon,getAllCoupon,getCoupon,updateCoupon,deleteCoupon,applyCoupon}from "../controller/couponController.js";

const router=express.Router();

router.post("/create-coupon",createCoupon);
router.get("/get-all-coupon",getAllCoupon);
router.get("/get-coupon/:id",getCoupon);
router.put("/update-coupon/:id",updateCoupon);
router.delete("/delete-coupon/:id",deleteCoupon);
router.post("/apply-coupon",applyCoupon);   
export default router;