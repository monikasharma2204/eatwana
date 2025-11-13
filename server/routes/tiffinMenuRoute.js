import express from "express";
import {
    addMenu,
    getAllMenus,
    getMenuById,
    updateMenu,
    deleteMenu
} from "../controllers/tiffinMenuController.js";

const router = express.Router();

// Add a weekly menu
router.post("/add", addMenu);

// Get all menus
router.get("/all", getAllMenus);

// Get a menu by id
router.get("/:id", getMenuById);

// Update a menu
router.put("/update/:id", updateMenu);

// Delete a menu
router.delete("/delete/:id", deleteMenu);

export default router;
