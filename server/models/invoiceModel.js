import mongoose from "mongoose";

// Invoice item schema for dish/tiffin orders
const invoiceItemSchema = new mongoose.Schema({
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
    itemName: {
        type: String,
        required: true,
        comment: "Name of the dish or tiffin"
    },
    quantity: {
        type: Number,
        default: 1,
        required: true
    },
    unitPrice: {
        type: Number,
        required: true,
        comment: "Price per unit"
    },
    totalPrice: {
        type: Number,
        required: true,
        comment: "Total price for this item (unitPrice * quantity)"
    },
    selectedVariant: {
        type: String,
        comment: "For dishes: quantity type (half/full), For tiffin: plan type (oneTime/monthly/etc)"
    },
    deliveryTimings: {
        type: [String],
        enum: ["breakfast", "lunch", "dinner"],
        default: [],
        comment: "Delivery timings for tiffin items (can include multiple timings)"
    },
    category: {
        type: String,
        comment: "For dishes: veg/non-veg, For tiffin: foodType"
    }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
    // Invoice type
    invoiceType: {
        type: String,
        enum: ["dish", "tiffin", "mealPlan"],
        required: true,
        comment: "Type of invoice: dish order, tiffin order, or meal plan payment"
    },

    // Customer reference
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    // Order reference (for dish/tiffin orders)
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        default: null,
        comment: "Reference to the order (for dish/tiffin invoices)"
    },

    // Meal plan reference (for meal plan invoices)
    mealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        default: null,
        comment: "The plan for which this payment was made (for meal plan invoices)"
    },

    // Invoice items (for dish/tiffin orders)
    items: {
        type: [invoiceItemSchema],
        default: [],
        comment: "Items in the invoice (for dish/tiffin orders)"
    },

    // Amount details
    subtotal: {
        type: Number,
        required: true,
        comment: "Subtotal before any discounts"
    },
    discount: {
        type: Number,
        default: 0,
        comment: "Total discount applied"
    },
    totalAmount: {
        type: Number,
        required: true,
        comment: "Total amount to be paid"
    },

    // Payment information
    paymentMethod: {
        type: String,
        enum: ["cod", "upi", "online"],
        default: "cod"
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending"
    },
    utrNumber: {
        type: String,
        default: null,
        comment: "UTR/Transaction ID for UPI/online payments"
    },

    // Delivery address
    deliveryAddress: {
        type: String,
        comment: "Delivery address for the order"
    },

    // Token information (for meal plan invoices)
    tokensCreated: {
        type: Number,
        default: 0,
        comment: "Tokens generated from payment (for meal plan invoices)"
    },
    previousTokenBalance: {
        type: Number,
        default: 0,
        comment: "Token balance before this payment (for meal plan invoices)"
    },
    newTokenBalance: {
        type: Number,
        default: 0,
        comment: "Token balance after adding tokens (for meal plan invoices)"
    },

    // Invoice number (auto-generated)
    invoiceNumber: {
        type: String,
        unique: true,
        comment: "Unique invoice number"
    },

    // Additional notes
    notes: {
        type: String,
        default: ""
    }

}, { timestamps: true });

// Generate invoice number before saving
invoiceSchema.pre("save", async function (next) {
    if (!this.invoiceNumber) {
        const prefix = this.invoiceType === "dish" ? "DISH" : this.invoiceType === "tiffin" ? "TIFFIN" : "MEAL";
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, "0");
        this.invoiceNumber = `${prefix}-${timestamp}-${random}`;
    }
    next();
});

export default mongoose.model("Invoice", invoiceSchema);
