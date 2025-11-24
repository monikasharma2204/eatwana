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
    // Structure: 
    // - oneTime: simple { price, discount } (single delivery)
    // - Other plans: { oneTime: { price, discount }, twoTime: { price, discount }, threeTime: { price, discount } }
    // Example: monthly.oneTime.price (for 1 timing), monthly.twoTime.price (for 2 timings), monthly.threeTime.price (for 3 timings)
    pricing: {
        oneTime: {
            price: { type: Number, default: 0 },
            discount: { type: Number, default: 0 }
        },
        monthly: {
            oneTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            twoTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            threeTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } }
        },
        quarterly: {
            oneTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            twoTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            threeTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } }
        },
        halfYearly: {
            oneTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            twoTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            threeTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } }
        },
        annual: {
            oneTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            twoTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } },
            threeTime: { price: { type: Number, default: 0 }, discount: { type: Number, default: 0 } }
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
