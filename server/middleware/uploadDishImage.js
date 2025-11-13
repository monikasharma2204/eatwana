// middleware/uploadDishImage.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directory exists
const uploadDir = "uploads/admin/dish";
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Create unique filename: dish-timestamp-randomstring.ext
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(
            null,
            "dish-" + uniqueSuffix + path.extname(file.originalname)
        );
    },
});

// File filter - only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(
            new Error(
                "Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP images are allowed."
            )
        );
    }
};

// Multer upload configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
    fileFilter: fileFilter,
});

// Utility function to delete old image
export const deleteImage = (imagePath) => {
    if (imagePath && fs.existsSync(imagePath)) {
        try {
            fs.unlinkSync(imagePath);
            return true;
        } catch (error) {
            console.error("Error deleting image:", error);
            return false;
        }
    }
    return false;
};

export default upload;