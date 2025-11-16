// routes/dishRoutes.js
import express from "express";
import upload from "../middleware/uploadDishImage.js";
import {
    createDish,
    getAllDishes,
    getDishById,
    searchDishes,
    getDishesByTag,
    updateDish,
    deleteDish,
    getDishStats,
} from "../controllers/dishController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// 📊 Statistics route (place before /:id to avoid conflicts)
router.get("/stats", getDishStats);

// 🔍 Search routes
router.get("/search", searchDishes);
router.get("/tag/:tag", getDishesByTag);

// 📝 CRUD routes
router.post("/add", adminAuth, upload.single("image"), createDish);
router.get("/all", getAllDishes);
router.get("/get/:id", getDishById);
router.put("/update/:id", adminAuth, upload.single("image"), updateDish);
router.delete("/delete/:id", adminAuth, deleteDish);

export default router;