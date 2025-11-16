import express from "express";
import {
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
} from "../controllers/subCategoryController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// =========================
// 🔹 Routes
// =========================
router.post("/add", adminAuth, createSubCategory);         // ➕ Create
router.get("/all", getSubCategories);              // 📜 Get all
router.get("/get/:id", getSubCategoryById);         // 🔍 Get by ID
router.put("/update/:id", adminAuth, updateSubCategory);          // ✏️ Update
router.delete("/delete/:id", adminAuth, deleteSubCategory);       // ❌ Delete

export default router;
