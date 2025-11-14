import mongoose from "mongoose";

const tiffinSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Reference to Menu
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "TiffinMenu",   // FIXED
        required: true
    },

    // Pricing plans & discounts
    pricing: {
        oneTime: {
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        },
        monthly: {
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        },
        quarterly: {
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        },
        halfYearly: {
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        },
        annual: {
            price: { type: Number, required: true },
            discount: { type: Number, default: 0 }
        }
    },

    // Rating
    rating: {
        averageRating: { type: Number, default: 0 },
        totalRatings: { type: Number, default: 0 }
    },

    // Tags for filtering
    tags: {
        type: [String],
        enum: ['special', 'normal', 'gym', 'premium', 'custom'],
        default: ['normal']
    },

    // NEW: veg / non-veg / egg
    foodType: {
        type: String,
        enum: ['veg', 'non-veg', 'egg'],
        required: true
    },

    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }

}, { timestamps: true });

export const Tiffin = mongoose.model("Tiffin", tiffinSchema);
