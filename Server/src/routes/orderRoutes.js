import express from "express";
import {createOrder,getAllOrders,getOrderById,updateOrder,deleteOrder,getAllOrdersAdmin} from "../controller/orderController.js";

const router=express.Router();

router.post("/create-order",createOrder);
router.get("/get-all-orders/:userId",getAllOrders);
router.get("/get-order/:orderId",getOrderById);
router.put("/update-order/:orderId",updateOrder);
router.delete("/delete-order/:orderId",deleteOrder); 
router.get("/get-all-orders-admin",getAllOrdersAdmin);

  
export default router;