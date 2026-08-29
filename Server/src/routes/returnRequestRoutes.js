import express from "express";
import {createReturnRequest,getAllReturnRequests,getReturnRequestOfUser,getSingleReturnRequest,updateReturnRequest,deleteReturnRequest}from "../controller/returnRequestController.js";

const router=express.Router();

router.post("/create-return-request",createReturnRequest);
router.get("/get-all-return-requests",getAllReturnRequests);
router.get("/get-return-request-of-user/:userId",getReturnRequestOfUser);
router.get("/get-single-return-request/:returnRequestId",getSingleReturnRequest);
router.put("/update-return-request/:returnRequestId",updateReturnRequest);
router.delete("/delete-return-request/:returnRequestId",deleteReturnRequest);   

export default router;