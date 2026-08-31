import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000, // 8 sec mein fail fast, hang nahi hoga
    });
    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
    // process.exit(1) BILKUL NAHI — serverless mein ye process ko kill kar deta hai
    throw error; // error ko route tak bhejo taake proper response mile
  }
};

export default connectDB;