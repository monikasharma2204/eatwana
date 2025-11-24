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
    deliveryTimings: {
        type: [String],
        enum: ["breakfast", "lunch", "dinner"],
        default: [],
        comment: "Delivery timings for tiffin items (can include multiple timings)"
    },
    price: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
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

    paymentMethod: {
        type: String,
        enum: ["upi", "cod"],
        default: "cod"
    },

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

    // ✅ Invoice generation tracking flags
    dishInvoiceGenerated: {
        type: Boolean,
        default: false,
        comment: "Tracks if dish invoice has been generated"
    },

    tiffinInvoiceGenerated: {
        type: Boolean,
        default: false,
        comment: "Tracks if tiffin invoice has been generated"
    },

    // ✅ NEW: Meal plan invoice tracking
    mealPlanInvoiceGenerated: {
        type: Boolean,
        default: false,
        comment: "Tracks if meal plan invoice has been generated"
    },

    // ✅ Store item data for invoice generation
    dishItemsData: {
        type: Array,
        default: [],
        comment: "Dish items data for invoice generation"
    },

    tiffinItemsData: {
        type: Array,
        default: [],
        comment: "Tiffin items data for invoice generation"
    },

    upiPayment: {
        method: { type: String, enum: ["upi", "cod"], default: "cod" },
        transactionId: { type: String },
        qrEnabled: { type: Boolean, default: false }
    }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);