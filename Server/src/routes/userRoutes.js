import express from "express";
import {register,login,getAllUsers} from "../controller/userController.js";
import {registerValidator,loginValidator} from "../validators/userValidator.js";
const router=express.Router();

router.post("/register",register);
router.post("/login",login);
router.get("/get-all-users",getAllUsers);


export default router;
