import { Tiffin } from "../models/tiffinModel.js";

// CREATE Tiffin
export const createTiffin = async (req, res) => {
    try {
        const tiffin = await Tiffin.create(req.body);
        console.log(tiffin.pricing.monthly)
        res.status(201).json({
            success: true,
            message: "Tiffin created successfully",
            data: tiffin
        });
    } catch (error) {
        console.error("Error creating tiffin:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create tiffin",
            error: error.message
        });
    }
};

// GET all Tiffins
export const getAllTiffins = async (req, res) => {
    try {
        const tiffins = await Tiffin.find().populate("menu");

        res.json({
            success: true,
            data: tiffins
        });
    } catch (error) {
        console.error("Error fetching tiffins:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tiffins",
            error: error.message
        });
    }
};

// GET single Tiffin
export const getTiffinById = async (req, res) => {
    try {
        const { id } = req.params;

        const tiffin = await Tiffin.findById(id).populate("menu");

        if (!tiffin) {
            return res.status(404).json({
                success: false,
                message: "Tiffin not found"
            });
        }

        res.json({
            success: true,
            data: tiffin
        });
    } catch (error) {
        console.error("Error fetching tiffin:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch tiffin",
            error: error.message
        });
    }
};

// UPDATE Tiffin
export const updateTiffin = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedTiffin = await Tiffin.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedTiffin) {
            return res.status(404).json({
                success: false,
                message: "Tiffin not found"
            });
        }

        res.json({
            success: true,
            message: "Tiffin updated successfully",
            data: updatedTiffin
        });
    } catch (error) {
        console.error("Error updating tiffin:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update tiffin",
            error: error.message
        });
    }
};

// DELETE Tiffin
export const deleteTiffin = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedTiffin = await Tiffin.findByIdAndDelete(id);

        if (!deletedTiffin) {
            return res.status(404).json({
                success: false,
                message: "Tiffin not found"
            });
        }

        res.json({
            success: true,
            message: "Tiffin deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting tiffin:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete tiffin",
            error: error.message
        });
    }
};
