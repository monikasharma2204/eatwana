import mongoose from "mongoose";

const tiffinSubscriptionSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        tiffin: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tiffin",
            required: true,
        },

        planType: {
            type: String,
            enum: ["One-Time", "Monthly", "Quarterly"],
            required: true,
        },

        startDate: {
            type: Date,
            default: Date.now,
        },

        endDate: {
            type: Date,
        },

        pricePaid: {
            type: Number,
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        // For renewal & tracking
        renewalCount: {
            type: Number,
            default: 0,
        },

        // Optional delivery preferences
        mealTimes: [
            {
                type: String,
                enum: ["Breakfast", "Lunch", "Dinner"],
            },
        ],

        deliveryAddress: {
            type: String,
            required: true,
        },

        paymentStatus: {
            type: String,
            enum: ["Pending", "Paid", "Failed"],
            default: "Pending",
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Automatically calculate end date
tiffinSubscriptionSchema.pre("save", function (next) {
    if (!this.endDate) {
        const duration =
            this.planType === "Monthly"
                ? 30
                : this.planType === "Quarterly"
                    ? 90
                    : 1;

        this.endDate = new Date(this.startDate);
        this.endDate.setDate(this.endDate.getDate() + duration);
    }
    next();
});

export default mongoose.model("TiffinSubscription", tiffinSubscriptionSchema);
