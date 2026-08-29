import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

const register = async (req, res) => {
  console.log("Body", req.body);

  try {
    const { name, email, password, PhoneNumber, role } = req.body;

    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new UserModel({
      name,
      email,
      password: hashedPassword,
      PhoneNumber,
      role,
    });

    await user.save();

    const newUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      role: user.role,
    };

    res.json({
      message: "User registered successfully",
      user: newUser,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "User registration failed",
      error: error.message,
    });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const loginUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      PhoneNumber: user.PhoneNumber,
      role: user.role,
    };

    res.json({
      message: "Login successful",
      token,
      user: loginUser,
    });

  } catch (error) {
    console.log(error.message);

    res.status(500).json({
      message: "Login failed",
      error: error.message,
    });
  }
};
// ===============================
// GET ALL USERS - ADMIN
// ===============================

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Users fetched successfully",
      users,
    });

  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to fetch users",
      error: error.message,
    });
  }
};




export { register, login,getAllUsers };