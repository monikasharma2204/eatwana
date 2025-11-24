import jwt from "jsonwebtoken";
import Customer from "../models/customerModel.js";   // Make sure this path matches your project

export const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access denied. No token provided.",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.USER_JWT_SECRET);

        // Fetch user
        const user = await Customer.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found.",
            });
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {

        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token expired. Please login again.",
            });
        }

        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }
};
