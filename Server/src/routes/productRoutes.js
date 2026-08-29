import express from "express";
import {addProduct,getAllProducts,getSingleProduct,updateProduct,deleteProduct} from "../controller/productController.js";
import upload from "../middleware/uploadMiddleware.js";


const router=express.Router();

router.post("/add-product",upload.array("images"),addProduct);
router.get("/get-products",getAllProducts);
router.get("/get-product/:id",getSingleProduct);
router.put("/update-product/:id",upload.array("images"),updateProduct);
router.delete("/delete-product/:id",deleteProduct);

export default router;
