import express from "express";
import {
    createSubCategory,
    getSubCategories,
    getSubCategoryById,
    updateSubCategory,
    deleteSubCategory,
} from "../controllers/subCategoryController.js";

const router = express.Router();

// =========================
// 🔹 Routes
// =========================
router.post("/add", createSubCategory);         // ➕ Create
router.get("/all", getSubCategories);              // 📜 Get all
router.get("/get/:id", getSubCategoryById);         // 🔍 Get by ID
router.put("/update/:id", updateSubCategory);          // ✏️ Update
router.delete("/delete/:id", deleteSubCategory);       // ❌ Delete

export default router;
