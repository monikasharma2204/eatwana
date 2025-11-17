import mongoose from "mongoose";

const mealPlanSchema = new mongoose.Schema({

    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer",
        required: true
    },

    // Attach your pre-defined weekly tiffin menu
    tiffinMenu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TiffinMenu",
        required: true,
        comment: "Pre-built weekly tiffin menu selected for the customer"
    },

    // Meal slots selected → for tracking delivery only
    mealSlots: [{
        type: String,
        enum: ["Breakfast", "Lunch", "Dinner"],
        required: true,
        comment: "Which meals customer receives daily (for tracking)"
    }],

    // Total cost of the full monthly plan
    totalPrice: {
        type: Number,
        required: true,
        comment: "Full 30-day plan price (admin set)"
    },

    // Amount customer actually paid at the time of plan activation
    amountPaid: {
        type: Number,
        required: true,
        comment: "Amount paid initially by customer for this plan"
    },

    mealsPerDay: {
        type: Number,
        enum: [1, 2, 3],
        required: true,
        comment: "How many meals per day the user is subscribed to"
    },

    days: {
        type: Number,
        default: 30,
        comment: "Plan is always 30 days"
    },

    // Auto-calculated fields
    totalMeals: {
        type: Number,
        required: true,
        comment: "Total possible meals = days × mealsPerDay"
    },

    pricePerMeal: {
        type: Number,
        required: true,
        comment: "totalPrice / totalMeals"
    },

    tokensGenerated: {
        type: Number,
        required: true,
        comment: "Tokens generated from AMOUNT PAID = amountPaid / pricePerMeal"
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, { timestamps: true });

export default mongoose.model("MealPlan", mealPlanSchema);
