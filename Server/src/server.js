import "dotenv/config"; 
import app from "./app.js";
import connectDB from "./config/db.js"; 

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "production") {
  connectDB() 
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Startup failed:", err.message);
      process.exit(1);
    });
}