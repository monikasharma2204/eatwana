import express from "express";
import {
    createTiffin,
    getAllTiffins,
    getTiffinById,
    updateTiffin,
    deleteTiffin
} from "../controllers/tiffinController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

// Create
router.post("/add", adminAuth, createTiffin);

// Read
router.get("/all", getAllTiffins);
router.get("/get/:id", getTiffinById);

// Update
router.put("/update/:id", adminAuth, updateTiffin);

// Delete
router.delete("/delete/:id", adminAuth, deleteTiffin);

export default router;
