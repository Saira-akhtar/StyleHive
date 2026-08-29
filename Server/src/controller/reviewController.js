import ReviewModel from "../models/reviewModel.js";
import ProductModel from "../models/productModel.js";
import OrderModel from "../models/orderModel.js";
import UserModel from "../models/userModel.js";

// CREATE REVIEW
const createReview = async (req, res) => {
  try {
    const { user, product, order, rating, comment, title } = req.body;

    if (!user || !product || !order || rating === undefined) {
      return res.status(400).json({
        message: "user, product, order and rating are required",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "rating should be between 1 and 5" });
    }

    // NEW: verify the order belongs to this user, is delivered,
    // and actually contains this product
    const validOrder = await OrderModel.findOne({
      _id: order,
      user,
      status: "delivered",
      "items.product": product,
    });

    if (!validOrder) {
      return res.status(403).json({
        message: "you can only review products from your delivered orders",
      });
    }

    const existingReview = await ReviewModel.findOne({ user, product });
    if (existingReview) {
      return res.status(400).json({ message: "review already exists" });
    }

    const review = await ReviewModel.create({ user, product, order, rating, comment, title });

    return res.status(201).json({ message: "review created successfully", review });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "failed to create review", error: error.message });
  }
};

// GET ALL REVIEWS OF PRODUCT
const getAllReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    const reviews = await ReviewModel.find({
      product: productId,
    })
      .populate("user", "name email")
      .populate("order", "orderNumber")
      .populate("product", "name price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "failed to get all reviews",
      error: error.message,
    });
  }
};

// GET ALL REVIEWS OF LOGGED-IN USER
const getMyReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await ReviewModel.find({
      user: userId,
    })
      .populate("product", "name price images")
      .populate("order", "orderNumber")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "user reviews fetched successfully",
      reviews,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "failed to get user reviews",
      error: error.message,
    });
  }
};

// GET SINGLE REVIEW
const getReviewById = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findById(reviewId)
      .populate("user", "name email")
      .populate("order", "orderNumber")
      .populate("product", "name price");

    if (!review) {
      return res.status(404).json({
        message: "review not found",
      });
    }

    return res.status(200).json({
      message: "review fetched successfully",
      review,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "failed to get review",
      error: error.message,
    });
  }
};

// UPDATE REVIEW
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment, title } = req.body;

    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "review not found",
      });
    }

    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "rating should be between 1 and 5",
        });
      }

      review.rating = rating;
    }

    if (comment !== undefined) {
      review.comment = comment;
    }

    if (title !== undefined) {
      review.title = title;
    }

    await review.save();

    return res.status(200).json({
      message: "review updated successfully",
      review,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "failed to update review",
      error: error.message,
    });
  }
};

// DELETE REVIEW
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await ReviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "review not found",
      });
    }

    await ReviewModel.findByIdAndDelete(reviewId);

    return res.status(200).json({
      message: "review deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "failed to delete review",
      error: error.message,
    });
  }
};

export {
  createReview,
  getAllReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
};