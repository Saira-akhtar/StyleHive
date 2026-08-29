import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    cartItems: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
            min: 1
        },
        priceAtAdd: {
            type: Number,
            required: true,
        },
        size: {
            type: String,
            default: null
        },
        color: {
            type: String,
            default: null
        },
        variantSku: {
            type: String,
            default: null
        }
    }]

});

const CartModel = mongoose.model("cart", cartSchema);

export default CartModel;