import cartModel from "../models/cartModel.js";
import ProductModel from "../models/productModel.js";

// Add to Cart
const addToCart = async (req, res) => {
    try {
        const { userId, productId, quantity, size, color } = req.body;

        // Convert quantity into Number
        const quantityNumber = Number(quantity) || 1;

        if (!userId || !productId) {
            return res.status(400).json({
                message: "UserId and ProductId are required"
            });
        }

        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        // Build variantSku from size+color to keep it as a unique identifier
        const variantSku =
            size || color ? `${size || "NA"}-${color || "NA"}` : null;

        // Find user cart
        let cart = await cartModel.findOne({
            user: userId
        });

        // If cart does not exist, create new cart
        if (!cart) {
            cart = await cartModel.create({
                user: userId,
                cartItems: [
                    {
                        product: productId,
                        quantity: quantityNumber,
                        priceAtAdd: product.price,
                        size: size || null,
                        color: color || null,
                        variantSku
                    }
                ]
            });

            return res.status(201).json({
                message: "Product added to cart successfully",
                cart
            });
        }

        // Check product + variant together
        const existingItem = cart.cartItems.find(
            (item) =>
                item.product.toString() === productId &&
                item.variantSku === variantSku
        );

        // Same product + same variant already exists
        if (existingItem) {
            existingItem.quantity += quantityNumber;
        }

        // New product + variant
        else {
            cart.cartItems.push({
                product: productId,
                quantity: quantityNumber,
                priceAtAdd: product.price,
                size: size || null,
                color: color || null,
                variantSku
            });
        }

        await cart.save();

        return res.status(200).json({
            message: "Product added to cart successfully",
            cart
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Failed to add to cart",
            error: error.message
        });
    }
};

// Get User Cart
const getUserCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await cartModel
            .findOne({ user: userId })
            .populate(
                "cartItems.product",
                "name price images"
            );

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        return res.status(200).json({
            message: "Cart fetched successfully",
            cart
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};


// Update Cart Item Quantity
const updateCartItemQuantity = async (req, res) => {
    try {
        const { userId, productId, variantSku } = req.params;
        const { quantity } = req.body;

        const quantityNumber = Number(quantity);

        if (!quantityNumber || quantityNumber < 1) {
            return res.status(400).json({
                message: "Quantity should be greater than 0"
            });
        }

        const cart = await cartModel.findOne({
            user: userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Convert "null" string to actual null
        const normalizedVariantSku =
            variantSku === "null" ? null : variantSku;

        const item = cart.cartItems.find(
            (item) =>
                item.product.toString() === productId &&
                item.variantSku === normalizedVariantSku
        );

        if (!item) {
            return res.status(404).json({
                message: "Product variant not found in cart"
            });
        }

        item.quantity = quantityNumber;

        await cart.save();

        return res.status(200).json({
            message: "Cart quantity updated successfully",
            cart
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Failed to update cart quantity",
            error: error.message
        });
    }
};



// Remove Product + Variant
const removeFromCart = async (req, res) => {
    try {
        const { userId, productId, variantSku } = req.params;

        const cart = await cartModel.findOne({
            user: userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        // Convert "null" string to actual null
        const normalizedVariantSku =
            variantSku === "null" ? null : variantSku;

        cart.cartItems = cart.cartItems.filter(
            (item) =>
                !(
                    item.product.toString() === productId &&
                    item.variantSku === normalizedVariantSku
                )
        );

        await cart.save();

        return res.status(200).json({
            message: "Product removed from cart successfully",
            cart
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Failed to remove from cart",
            error: error.message
        });
    }
};


// Clear Entire Cart
const clearCart = async (req, res) => {
    try {
        const { userId } = req.params;

        const cart = await cartModel.findOne({
            user: userId
        });

        if (!cart) {
            return res.status(404).json({
                message: "Cart not found"
            });
        }

        cart.cartItems = [];

        await cart.save();

        return res.status(200).json({
            message: "Cart cleared successfully",
            cart
        });

    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "Failed to clear cart",
            error: error.message
        });
    }
};


export {
    addToCart,
    getUserCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart
};