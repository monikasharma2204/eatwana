import express from "express";
import {
    addMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu
} from "../controllers/tiffinMenuController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Add a weekly menu
router.post("/add", adminAuth, addMenu);

// Get all menus
router.get("/all", getAllMenus);

// Get a menu by id
router.get("/get/:id", getMenuById);

// Update a menu
router.put("/update/:id", adminAuth, updateMenu);

// Delete a menu
router.delete("/delete/:id", adminAuth, deleteMenu);

export default router;
