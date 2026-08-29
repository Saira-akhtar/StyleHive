import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import cartModel from "../models/cartModel.js";

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const {
      user,
      shippingAddress,
      couponCode,
      payment,
      discount = 0,
      shipping = 0,
      tax = 0,
    } = req.body;
    if (!user || !shippingAddress || !payment) {
      return res.status(400).json({
        message: "user,shippingAddress and payment are required ",
      });
    }

    const cart = await cartModel
      .findOne({ user })
      .populate("cartItems.product");
    if (!cart || cart.cartItems.length === 0) {
      return res.status(400).json({
        message: "cart is empty",
      });
    }

    const orderItems = cart.cartItems.map((item) => {
      const unitPrice = item.priceAtAdd;
      const lineTotal = unitPrice * item.quantity;
      return {
        product: item.product,
        quantity: item.quantity,
        name: item.product.name,
        color: item.color, 
        size: item.size, 
        unitPrice: unitPrice,
        lineTotal: lineTotal,
      };
    });

    const subTotal = orderItems.reduce(
      (total, item) => total + item.lineTotal,
      0,
    );

    const total = subTotal - discount + shipping + tax;

    const orderNumber = `ORD-${Date.now()}`;

    // Create order
    const order = await orderModel.create({
      user,
      orderNumber,
      items: orderItems,
      shippingAddress,
      pricing: {
        subtotal: subTotal,
        discount: discount,
        shipping: shipping,
        tax: tax,
        total: total,
      },
      couponCode,
      status: "pending",
      payment: {
        provider: payment.provider,
        paymentId: payment.paymentId,
        status: payment.status || "unpaid",
        paidDate: payment.status === "paid" ? new Date() : null,
      },
    });

    //clear cart after order creation
    cart.cartItems = [];
    await cart.save();
    return res.status(201).json({
      message: "order created successfully",
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "failed to create order",
      error: error.message,
    });
  }
};

// GET ALL ORDERS
const getAllOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await orderModel
      .find({ user: userId })
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      message: "orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "failed to get all orders",
      error: error.message,
    });
  }
};

// GET SINGLE ORDER

const getOrderById = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel
      .findById(orderId)
      .populate("user", "name email")
      .populate("items.product");
    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }
    return res.status(200).json({
      message: "order fetched successfully",
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "failed to get order",
      error: error.message,
    });
  }
};

// UPDATE ORDER
const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const allowedStatus = [
      "pending",
      "processing",
      "cancelled",
      "shipped",
      "delivered",
      "returned",
    ];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "status should be one of these " + allowedStatus.join(","),
      });
    }
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }
    order.status = status;
    order.updatedAt = Date.now();
    await order.save();
    return res.status(200).json({
      message: "order updated successfully",
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "failed to update order",
      error: error.message,
    });
  }
};

// DELETE ORDER

const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "order not found",
      });
    }
    if (
      order.status === "shipped" ||
      order.status === "delivered" ||
      order.status === "returned"
    ) {
      return res.status(400).json({
        message: "order cannot be canceled",
      });
    }
    order.status = "cancelled";
    order.updatedAt = Date.now();
    await order.save();
    return res.status(200).json({
      message: "order cancelled successfully",
      order,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: "failed to delete order",
      error: error.message,
    });
  }
};
// GET ALL ORDERS FOR ADMIN

const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await orderModel
      .find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "all orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.log(error.message);

    return res.status(500).json({
      message: "failed to get all orders",
      error: error.message,
    });
  }
};

export { createOrder, getAllOrders, getOrderById, updateOrder, deleteOrder, getAllOrdersAdmin };
