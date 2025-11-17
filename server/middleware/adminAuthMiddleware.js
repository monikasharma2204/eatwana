import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const adminAuth = async (req, res, next) => {
    try {
        // console.log(req.headers)
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET);

        const admin = await Admin.findById(decoded.id);
        if (!admin) return res.status(401).json({ message: "Invalid token admin not found" });

        req.admin = admin; // attach admin to request
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
