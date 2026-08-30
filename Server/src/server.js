import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors"; // <-- Yeh line add karein

dotenv.config();

connectDB();


app.use(cors()); 

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;