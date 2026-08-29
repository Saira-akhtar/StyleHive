import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

connectDB();

app.listen(5000,()=>{
    console.log("server is running on port 5000");
});