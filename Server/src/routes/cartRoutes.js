import express from "express";
import {addToCart,getUserCart,updateCartItemQuantity,removeFromCart,clearCart} from "../controller/cartController.js";
import protect from "../middleware/authMiddleware.js";

const router=express.Router();

router.post("/add-to-cart",protect,addToCart);
router.get("/get-cart/:userId",protect,getUserCart);
router.put("/update-cart-item-quantity/:userId/:productId/:variantSku",protect,updateCartItemQuantity);
router.delete("/remove-from-cart/:userId/:productId/:variantSku",protect,removeFromCart);
router.delete("/clear-cart/:userId",protect,clearCart);

export default router;