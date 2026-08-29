import ProductModel from "../models/productModel.js";
import CategoryModel from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

//Add Product
const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      category,
      stock,
      rating,
      averageRating,
      numReviews,
      variants,
    } = req.body;

    // Check category
    const existingCategory = await CategoryModel.findById(category);

    if (!existingCategory) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    // Parse variants (comes as JSON string in form-data)
    let parsedVariants = [];

    if (variants) {
      try {
        parsedVariants =
          typeof variants === "string" ? JSON.parse(variants) : variants;
      } catch (err) {
        return res.status(400).json({
          message: "variants must be valid JSON — e.g. [{size, color, stock}]",
        });
      }
    }

    // Upload images
    const images = [];

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(file.buffer);
        });

        images.push(result.secure_url);
      }
    }

    // Create product
    const product = new ProductModel({
      name,
      description,
      price,
      brand,
      category,
      stock,
      rating,
      averageRating,
      numReviews,
      variants: parsedVariants,
      images,
    });

    await product.save();

    return res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.log("ADD PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Product addition failed",
      error: error.message,
    });
  }
};


//Get All Products
const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find().populate("category");
    res.json({ message: "Products fetched successfully", products });
  } catch (error) {
    console.log(error.message);
    res.json({ message: "Failed to fetch products", error: error.message });
  }
};

//Get Single Product
const getSingleProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id).populate("category");
    if (!product) {
      res.json({ message: "product not found" });
    }

    res.status(200).json({ message: "product fetched successfully", product });
  } catch (error) {
    console.log(error.message);
    res.json({ message: "Failed to fetch product", error: error.message });
  }
};


//update product

const updateProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      brand,
      category,
      stock,
      rating,
      averageRating,
      numReviews,
      isActive,
      variants,
    } = req.body;

    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Update text fields
    if (name !== undefined) {
      product.name = name;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (price !== undefined) {
      product.price = price;
    }

    if (brand !== undefined) {
      product.brand = brand;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (stock !== undefined) {
      product.stock = stock;
    }

    if (rating !== undefined) {
      product.rating = rating;
    }

    if (averageRating !== undefined) {
      product.averageRating = averageRating;
    }

    if (numReviews !== undefined) {
      product.numReviews = numReviews;
    }

    if (isActive !== undefined) {
      product.isActive = isActive;
    }

    // Update variants (comes as JSON string in form-data)
    if (variants !== undefined) {
      try {
        product.variants =
          typeof variants === "string" ? JSON.parse(variants) : variants;
      } catch (err) {
        return res.status(400).json({
          message: "variants must be valid JSON — e.g. [{size, color, stock}]",
        });
      }
    }

    // Update images
    if (req.files && req.files.length > 0) {
      const newImages = [];

      for (const file of req.files) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "products",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          );

          stream.end(file.buffer);
        });

        newImages.push(result.secure_url);
      }

      // Replace old images with new images
      product.images = newImages;
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.log("UPDATE PRODUCT ERROR:", error);

    return res.status(500).json({
      message: "Product update failed",
      error: error.message,
    });
  }
};

//delete product

const deleteProduct = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    await ProductModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ message: "Product deletion failed", error: error.message });
  }
};

export { addProduct, getAllProducts, getSingleProduct, updateProduct, deleteProduct };