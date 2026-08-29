import CouponModel from "../models/couponModel.js";

// CREATE COUPON
const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expireDate,
      useageLimit,
      isActive,
    } = req.body;

    // Check required fields
    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      minPurchase === undefined ||
      !expireDate
    ) {
      return res.status(400).json({
        message: "Please provide all the required fields",
      });
    }

    // Check discount type
    if (discountType !== "percentage" && discountType !== "fixed") {
      return res.status(400).json({
        message: "Discount type should be either percentage or fixed",
      });
    }

    // Percentage discount cannot be greater than 100
    if (
      discountType === "percentage" &&
      (discountValue < 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        message: "Percentage discount should be between 0 and 100",
      });
    }

    // Check discount value
    if (discountValue < 0) {
      return res.status(400).json({
        message: "Discount value cannot be negative",
      });
    }

    // Check minimum purchase
    if (minPurchase < 0) {
      return res.status(400).json({
        message: "Minimum purchase cannot be negative",
      });
    }

    // Check expiry date
    if (new Date(expireDate) <= new Date()) {
      return res.status(400).json({
        message: "Expire date must be in the future",
      });
    }

    // Check if coupon already exists
    const existingCoupon = await CouponModel.findOne({
      code: code.toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(400).json({
        message: "Coupon code already exists",
      });
    }

    // Create coupon
    const coupon = await CouponModel.create({
      code: code.toUpperCase(),
      discountType,
      discountValue,
      minPurchase,
      maxDiscount: maxDiscount || null,
      expireDate,
      useageLimit: useageLimit || null,
      usedCount: 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    return res.status(201).json({
      message: "Coupon created successfully",
      coupon,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to create coupon",
      error: error.message,
    });
  }
};

// GET ALL COUPONS
const getAllCoupon = async (req, res) => {
  try {
    const coupon = await CouponModel.find().sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Coupons fetched successfully",
      coupon,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to get all coupons",
      error: error.message,
    });
  }
};

// GET SINGLE COUPON
const getCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await CouponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    return res.status(200).json({
      message: "Coupon fetched successfully",
      coupon,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to get coupon",
      error: error.message,
    });
  }
};

// UPDATE COUPON
const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await CouponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    const {
      code,
      discountType,
      discountValue,
      minPurchase,
      maxDiscount,
      expireDate,
      useageLimit,
      isActive,
    } = req.body;

    // Check discount type
    if (
      discountType &&
      discountType !== "percentage" &&
      discountType !== "fixed"
    ) {
      return res.status(400).json({
        message: "Discount type should be either percentage or fixed",
      });
    }

    // Check discount value
    if (
      discountType === "percentage" &&
      discountValue !== undefined &&
      (discountValue < 0 || discountValue > 100)
    ) {
      return res.status(400).json({
        message: "Percentage discount should be between 0 and 100",
      });
    }

    // Check duplicate coupon code
    if (code) {
      const existingCoupon = await CouponModel.findOne({
        code: code.toUpperCase(),
        _id: { $ne: id },
      });

      if (existingCoupon) {
        return res.status(400).json({
          message: "Coupon code already exists",
        });
      }

      coupon.code = code.toUpperCase();
    }

    if (discountType) {
      coupon.discountType = discountType;
    }

    if (discountValue !== undefined) {
      coupon.discountValue = discountValue;
    }

    if (minPurchase !== undefined) {
      coupon.minPurchase = minPurchase;
    }

    if (maxDiscount !== undefined) {
      coupon.maxDiscount = maxDiscount;
    }

    if (expireDate) {
      if (new Date(expireDate) <= new Date()) {
        return res.status(400).json({
          message: "Expire date must be in the future",
        });
      }

      coupon.expireDate = expireDate;
    }

    if (useageLimit !== undefined) {
      coupon.useageLimit = useageLimit;
    }

    if (isActive !== undefined) {
      coupon.isActive = isActive;
    }

    await coupon.save();

    return res.status(200).json({
      message: "Coupon updated successfully",
      coupon,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to update coupon",
      error: error.message,
    });
  }
};

// DELETE COUPON
const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await CouponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    await CouponModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Coupon deleted successfully",
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to delete coupon",
      error: error.message,
    });
  }
};

// APPLY COUPON
const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Please provide coupon code",
      });
    }

    const total = Number(cartTotal);

    if (isNaN(total) || total < 0) {
      return res.status(400).json({
        message: "Cart total should be a valid number",
      });
    }

    // Find coupon
    const coupon = await CouponModel.findOne({
      code: code.toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        message: "Coupon not found",
      });
    }

    // Check active
    if (!coupon.isActive) {
      return res.status(400).json({
        message: "Coupon is not active",
      });
    }

    // Check expiry date
    if (new Date(coupon.expireDate) <= new Date()) {
      return res.status(400).json({
        message: "Coupon is expired",
      });
    }

    // Check usage limit
    if (coupon.useageLimit !== null && coupon.usedCount >= coupon.useageLimit) {
      return res.status(400).json({
        message: "Coupon usage limit reached",
      });
    }

    // Check minimum purchase
    
    if (total < coupon.minPurchase) {
      return res.status(400).json({
        message: `Minimum purchase of Rs. ${coupon.minPurchase} is required to use this coupon`,
      });
    }

    // Calculate discount
    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = total * (coupon.discountValue / 100);

      // Apply maximum discount
      if (coupon.maxDiscount !== null && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      // Fixed discount
      discount = coupon.discountValue;
    }

    // Discount cannot be greater than cart total
    if (discount > total) {
      discount = total;
    }

    const newTotal = total - discount;

    return res.status(200).json({
      message: "Coupon applied successfully",
      couponCode: coupon.code,
      discount,
      cartTotal: total,
      newTotal,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "Failed to apply coupon",
      error: error.message,
    });
  }
};

export {
  createCoupon,
  getAllCoupon,
  getCoupon,
  updateCoupon,
  deleteCoupon,
  applyCoupon,
};
