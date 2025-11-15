import express from "express";
import {
    registerAdmin,
    loginAdmin,
    generateAdminOTP,
    verifyAdminOTP
} from "../controllers/adminController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";


const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.post("/generate-otp", generateAdminOTP);
router.post("/verify-otp", verifyAdminOTP);

// protected route
router.get("/validate", adminAuth, (req, res) => {
    res.status(200).json({ admin: req.admin });
});

export default router;
