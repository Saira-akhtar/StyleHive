import express from "express";
import {addCategory,getAllCategories,getSingleCategory,updateCategory,deleteCategory} from "../controller/categoryController.js";
import upload from "../middleware/uploadMiddleware.js";



const router=express.Router();
router.post("/add-category" , upload.single("image"),addCategory);
router.get("/get-categories",getAllCategories);
router.get("/get-category/:id",getSingleCategory);
router.put("/update-category/:id",upload.single("image"),updateCategory);
router.delete("/delete-category/:id",deleteCategory);

export default router;