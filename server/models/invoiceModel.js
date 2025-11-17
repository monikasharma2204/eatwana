import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    mealPlan: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MealPlan",
        required: true,
        comment: "The plan for which this payment was made"
    },

    amountPaid: {
        type: Number,
        required: true,
        comment: "Amount paid by customer"
    },

    tokensCreated: {
        type: Number,
        required: true,
        comment: "Tokens generated from payment"
    },

    previousTokenBalance: {
        type: Number,
        required: true,
        comment: "Token balance before this payment"
    },

    newTokenBalance: {
        type: Number,
        required: true,
        comment: "Token balance after adding tokens"
    }

}, { timestamps: true });

export default mongoose.model("Invoice", invoiceSchema);
