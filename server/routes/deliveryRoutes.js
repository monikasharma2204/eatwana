// routes/deliveryRoutes.js
import express from "express";
import { markMealDelivered, getAllDeliveries, getDeliveriesByCustomer } from "../controllers/deliveryController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Mark a meal delivered & reduce 1 token
router.post("/deliver", adminAuth, markMealDelivered);
// Get all deliveries (Admin)
router.get("/all", adminAuth, getAllDeliveries);

// Get deliveries for one customer
router.get("/customer/:customerId", adminAuth, getDeliveriesByCustomer);
export default router;
