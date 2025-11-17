// routes/deliveryRoutes.js
import express from "express";
import { markMealDelivered } from "../controllers/deliveryController.js";

const router = express.Router();

// Mark a meal delivered & reduce 1 token
router.post("/deliver", markMealDelivered);

export default router;
