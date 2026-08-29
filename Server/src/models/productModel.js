import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  brand: {
    type: String,
    required: true,
    trim: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  variants: [
    {
      size: { type: String },
      color: { type: String },
      stock: { type: Number, default: 0 },
    },
  ],
  rating: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  averageRating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
});

const ProductModel = mongoose.model("Product", productSchema,"products");

export default ProductModel;
