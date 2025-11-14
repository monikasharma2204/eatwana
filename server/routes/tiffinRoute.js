import express from "express";
import {
    createTiffin,
    getAllTiffins,
    getTiffinById,
    updateTiffin,
    deleteTiffin
} from "../controllers/tiffinController.js";

const router = express.Router();

// Create
router.post("/add", createTiffin);

// Read
router.get("/all", getAllTiffins);
router.get("/get/:id", getTiffinById);

// Update
router.put("/update/:id", updateTiffin);

// Delete
router.delete("/delete/:id", deleteTiffin);

export default router;
