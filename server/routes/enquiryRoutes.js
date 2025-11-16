import express from "express";
import { createEnquiry, getAllEnquiries, getEnquiryById, deleteEnquiry } from "../controllers/enquiryController.js";
import { adminAuth } from "../middleware/adminAuthMiddleware.js";

const router = express.Router();

router.post("/add", createEnquiry);
router.get("/all", adminAuth, getAllEnquiries);
router.get("/:id", adminAuth, getEnquiryById);
router.delete("/:id", adminAuth, deleteEnquiry);

export default router;
