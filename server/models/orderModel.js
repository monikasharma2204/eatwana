import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
    itemType: {
        type: String,
        enum: ["Dish", "Tiffin"],
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        refPath: "items.itemType"
    },
    quantity: { type: Number, default: 1 },
    selectedVariant: { type: String },
    price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    items: {
        type: [orderItemSchema],
        required: true
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },

    /** ✅ New field added */
    utrNumber: {
        type: String,
        default: null
    },

    orderStatus: {
        type: String,
        enum: [
            "pending",
            "order_confirmed",
            "preparing",
            "dispatch",
            "on_the_way",
            "delivered",
            "cancelled"
        ],
        default: "pending"
    },

    address: {
        type: String,
        required: true
    },

    upiPayment: {
        method: { type: String, enum: ["upi", "cod"], default: "cod" },
        transactionId: { type: String },
        qrEnabled: { type: Boolean, default: false }
    }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
