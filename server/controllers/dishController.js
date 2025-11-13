// controllers/dishController.js
import Dish from "../models/dishModel.js";
import { deleteImage } from "../middleware/uploadDishImage.js";
import mongoose from "mongoose";
// 📝 CREATE - Add new dish
export const createDish = async (req, res) => {
    try {
        const {
            name,
            rating,
            category,
            subCategory,
            mealType,
            quantities,
            isAvailable,
            description,
            tags,
        } = req.body;

        console.log("File:", req.file);
        console.log("Body:", req.body);

        // Validate image upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Dish image is required",
            });
        }

        // Validate required fields
        if (!name || !category || !subCategory) {
            if (req.file && req.file.path) {
                deleteImage(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Name, category, and subCategory are required fields",
            });
        }

        // Parse quantities if sent as string
        let parsedQuantities = quantities;
        if (typeof quantities === "string") {
            try {
                parsedQuantities = JSON.parse(quantities);
            } catch (error) {
                if (req.file && req.file.path) {
                    deleteImage(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: "Invalid quantities format. Expected JSON array.",
                });
            }
        }

        // Validate quantities structure and map to model schema
        if (!Array.isArray(parsedQuantities) || parsedQuantities.length === 0) {
            if (req.file && req.file.path) {
                deleteImage(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "At least one quantity option is required",
            });
        }

        // Map quantities to match the model schema (size -> type)
        const formattedQuantities = parsedQuantities.map((q) => {
            if (!q.size && !q.type) {
                throw new Error("Quantity must have a 'size' or 'type' field");
            }
            if (!q.price) {
                throw new Error("Quantity must have a 'price' field");
            }

            return {
                type: q.type || q.size, // Use 'type' if present, otherwise 'size'
                price: parseFloat(q.price),
                discountPrice: q.discountPrice ? parseFloat(q.discountPrice) : 0,
            };
        });

        // Parse tags if sent as string
        let parsedTags = [];
        if (tags) {
            if (typeof tags === "string") {
                try {
                    parsedTags = JSON.parse(tags);
                    // If parsed result is not an array, convert to array
                    if (!Array.isArray(parsedTags)) {
                        parsedTags = [];
                    }
                } catch (error) {
                    // If JSON parse fails, split by comma
                    parsedTags = tags.split(",").map((tag) => tag.trim()).filter(tag => tag);
                }
            } else if (Array.isArray(tags)) {
                parsedTags = tags;
            }
        }

        // Convert isAvailable string to boolean
        const parsedIsAvailable = isAvailable === 'true' || isAvailable === true;

        // Validate category
        if (!["veg", "non-veg"].includes(category)) {
            if (req.file && req.file.path) {
                deleteImage(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Category must be either 'veg' or 'non-veg'",
            });
        }

        // Validate mealType
        const validMealTypes = ["normal", "special", "gym"];
        const parsedMealType = mealType || "normal";
        if (!validMealTypes.includes(parsedMealType)) {
            if (req.file && req.file.path) {
                deleteImage(req.file.path);
            }
            return res.status(400).json({
                success: false,
                message: "Meal type must be 'normal', 'special', or 'gym'",
            });
        }

        // Parse and validate rating
        let parsedRating = 0;
        if (rating) {
            parsedRating = parseFloat(rating);
            if (parsedRating < 0 || parsedRating > 5) {
                if (req.file && req.file.path) {
                    deleteImage(req.file.path);
                }
                return res.status(400).json({
                    success: false,
                    message: "Rating must be between 0 and 5",
                });
            }
        }

        // Create dish
        const dish = await Dish.create({
            name,
            image: req.file.path,
            rating: parsedRating,
            category,
            subCategory,
            mealType: parsedMealType,
            quantities: formattedQuantities,
            isAvailable: parsedIsAvailable,
            description: description || "",
            tags: parsedTags,
        });

        // Populate subCategory details
        await dish.populate("subCategory");

        res.status(201).json({
            success: true,
            message: "Dish created successfully",
            data: dish,
        });
    } catch (error) {
        // Delete uploaded image if dish creation fails
        if (req.file && req.file.path) {
            deleteImage(req.file.path);
        }

        console.error("Error creating dish:", error);

        // Handle mongoose validation errors
        if (error.name === "ValidationError") {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: messages,
            });
        }

        // Handle cast errors (invalid ObjectId)
        if (error.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid subCategory ID format",
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to create dish",
        });
    }
};

// 📖 READ - Get all dishes with filters and pagination
export const getAllDishes = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            mealType,
            subCategory,
            isAvailable,
            sortBy = "createdAt",
            order = "desc",
        } = req.query;

        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (mealType) filter.mealType = mealType;
        if (subCategory) filter.subCategory = subCategory;
        if (isAvailable !== undefined) filter.isAvailable = isAvailable === "true";

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const sortOrder = order === "asc" ? 1 : -1;

        // Get dishes with pagination
        const dishes = await Dish.find(filter)
            .populate("subCategory")
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(parseInt(limit));

        // Get total count
        const total = await Dish.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: dishes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dishes",
        });
    }
};

// 📖 READ - Get dish by ID
export const getDishById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid dish ID format",
            });
        }

        const dish = await Dish.findById(id).populate("subCategory");

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found",
            });
        }

        res.status(200).json({
            success: true,
            data: dish,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dish",
        });
    }
};

// 🔍 SEARCH - Search dishes by name, description, or tags
export const searchDishes = async (req, res) => {
    try {
        const {
            q,
            tag,
            category,
            mealType,
            page = 1,
            limit = 10,
        } = req.query;

        if (!q && !tag) {
            return res.status(400).json({
                success: false,
                message: "Search query (q) or tag is required",
            });
        }

        // Build search filter
        const filter = {};

        if (q) {
            // Text search across name, description, and tags
            filter.$or = [
                { name: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { tags: { $in: [new RegExp(q, "i")] } },
                { searchTerms: { $regex: q, $options: "i" } },
            ];
        }

        if (tag) {
            filter.tags = { $in: [new RegExp(tag, "i")] };
        }

        if (category) {
            filter.category = category;
        }

        if (mealType) {
            filter.mealType = mealType;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Execute search
        const dishes = await Dish.find(filter)
            .populate("subCategory")
            .sort({ rating: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Dish.countDocuments(filter);

        res.status(200).json({
            success: true,
            searchQuery: q || tag,
            data: dishes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to search dishes",
        });
    }
};

// 🔍 READ - Get dishes by tag
export const getDishesByTag = async (req, res) => {
    try {
        const { tag } = req.params;
        const { page = 1, limit = 10 } = req.query;

        if (!tag) {
            return res.status(400).json({
                success: false,
                message: "Tag is required",
            });
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);

        // Find dishes with matching tag (case-insensitive)
        const dishes = await Dish.find({
            tags: { $in: [new RegExp(tag, "i")] },
        })
            .populate("subCategory")
            .sort({ rating: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Dish.countDocuments({
            tags: { $in: [new RegExp(tag, "i")] },
        });

        res.status(200).json({
            success: true,
            tag,
            data: dishes,
            pagination: {
                currentPage: parseInt(page),
                totalPages: Math.ceil(total / parseInt(limit)),
                totalItems: total,
                itemsPerPage: parseInt(limit),
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dishes by tag",
        });
    }
};

// ✏️ UPDATE - Update dish
export const updateDish = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid dish ID format",
            });
        }

        // Find existing dish
        const existingDish = await Dish.findById(id);
        if (!existingDish) {
            // Delete uploaded image if dish not found
            if (req.file && req.file.path) {
                deleteImage(req.file.path);
            }
            return res.status(404).json({
                success: false,
                message: "Dish not found",
            });
        }

        const updateData = { ...req.body };

        // Parse quantities if sent as string
        if (updateData.quantities && typeof updateData.quantities === "string") {
            try {
                updateData.quantities = JSON.parse(updateData.quantities);
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid quantities format",
                });
            }
        }

        // Parse tags if sent as string
        if (updateData.tags && typeof updateData.tags === "string") {
            try {
                updateData.tags = JSON.parse(updateData.tags);
            } catch (error) {
                updateData.tags = updateData.tags.split(",").map((tag) => tag.trim());
            }
        }

        // Handle image update
        if (req.file) {
            // Delete old image
            if (existingDish.image) {
                deleteImage(existingDish.image);
            }
            updateData.image = req.file.path;
        }

        // Update dish
        const updatedDish = await Dish.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        ).populate("subCategory");

        res.status(200).json({
            success: true,
            message: "Dish updated successfully",
            data: updatedDish,
        });
    } catch (error) {
        // Delete uploaded image if update fails
        if (req.file && req.file.path) {
            deleteImage(req.file.path);
        }

        res.status(500).json({
            success: false,
            message: error.message || "Failed to update dish",
            error: error.name === "ValidationError" ? error.errors : undefined,
        });
    }
};

// 🗑️ DELETE - Delete dish
export const deleteDish = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid dish ID format",
            });
        }

        const dish = await Dish.findById(id);

        if (!dish) {
            return res.status(404).json({
                success: false,
                message: "Dish not found",
            });
        }

        // Delete image from filesystem
        if (dish.image) {
            deleteImage(dish.image);
        }

        // Delete dish from database
        await Dish.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Dish deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to delete dish",
        });
    }
};

// 📊 STATS - Get dish statistics
export const getDishStats = async (req, res) => {
    try {
        const totalDishes = await Dish.countDocuments();
        const vegDishes = await Dish.countDocuments({ category: "veg" });
        const nonVegDishes = await Dish.countDocuments({ category: "non-veg" });
        const availableDishes = await Dish.countDocuments({ isAvailable: true });

        const mealTypeStats = await Dish.aggregate([
            {
                $group: {
                    _id: "$mealType",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            data: {
                total: totalDishes,
                veg: vegDishes,
                nonVeg: nonVegDishes,
                available: availableDishes,
                unavailable: totalDishes - availableDishes,
                byMealType: mealTypeStats,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch dish statistics",
        });
    }
};