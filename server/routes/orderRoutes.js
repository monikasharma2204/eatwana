import express from "express";
import {
    placeOrder,
    updateOrderStatus,
    getUserOrders,
    getAllOrders,
    verifyUPIPayment
} from "../controllers/orderController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";


const router = express.Router();

router.post("/place", authMiddleware, placeOrder);
router.get("/my-orders", authMiddleware, getUserOrders);
router.get("/all", adminAuth, getAllOrders);
router.put("/status/:orderId", adminAuth, updateOrderStatus);

router.put("/verify-upi/:orderId", authMiddleware, verifyUPIPayment);


export default router;
