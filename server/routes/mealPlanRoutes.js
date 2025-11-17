// routes/mealPlanRoutes.js
import express from "express";
import { createMealPlan } from "../controllers/mealPlanController.js";

const router = express.Router();

// Create meal plan & auto-generate invoice
router.post("/create-plan", createMealPlan);

export default router;
