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

const router = express.Router();

// 📊 Statistics route (place before /:id to avoid conflicts)
router.get("/stats", getDishStats);

// 🔍 Search routes
router.get("/search", searchDishes);
router.get("/tag/:tag", getDishesByTag);

// 📝 CRUD routes
router.post("/add", upload.single("image"), createDish);
router.get("/all", getAllDishes);
router.get("/get/:id", getDishById);
router.put("/update/:id", upload.single("image"), updateDish);
router.delete("/delete/:id", deleteDish);

export default router;