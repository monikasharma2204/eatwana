// routes/mealPlanRoutes.js
import express from "express";
import { createMealPlan, getAllMealPlans, getMealPlanById, updateMealPlan } from "../controllers/mealPlanController.js";

const router = express.Router();

// Create meal plan & auto-generate invoice
router.post("/create-plan", createMealPlan);

// Get one meal plan (with detailed view)
router.get("/get/:planId", getMealPlanById);

// Get all meal plans (admin dashboard)
router.get("/all", getAllMealPlans);
router.put("/update/:planId", updateMealPlan);
export default router;
