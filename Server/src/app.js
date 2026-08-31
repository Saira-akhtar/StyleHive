import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import returnRequestRoutes from "./routes/returnRequestRoutes.js";
import cors from "cors";


dotenv.config();
const app=express();
app.use(cors()); 

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("welcome to stylehive server");
});
app.use("/api/auth",userRoutes);
app.use("/api/category",categoryRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/review",reviewRoutes);
app.use("/api/return-request",returnRequestRoutes);

export default app;