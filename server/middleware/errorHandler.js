// middleware/errorHandler.js
import { deleteImage } from "./uploadDishImage.js";

// Global error handler for Multer and other errors
export const errorHandler = (err, req, res, next) => {
    // Delete uploaded file if there was an error
    if (req.file && req.file.path) {
        deleteImage(req.file.path);
    }

    // Multer file size error
    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).json({
            success: false,
            message: "File size too large. Maximum allowed size is 2MB.",
        });
    }

    // Multer file type error
    if (err.message && err.message.includes("Invalid file type")) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    // Multer unexpected field error
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return res.status(400).json({
            success: false,
            message: "Unexpected field in form data. Use 'image' field for upload.",
        });
    }

    // MongoDB duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return res.status(400).json({
            success: false,
            message: `Duplicate value for ${field}. Please use another value.`,
        });
    }

    // MongoDB validation error
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: messages,
        });
    }

    // MongoDB CastError (invalid ObjectId)
    if (err.name === "CastError") {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}`,
        });
    }

    // Default error
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

// Not found handler
export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};