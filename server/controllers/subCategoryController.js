import SubCategory from "../models/dishSubCategory.js";

// =========================
// 🔹 Create Subcategory
// =========================
export const createSubCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        console.log(name, description)
        if (!name) {
            return res.status(400).json({ success: false, message: "Sub-category name is required" });
        }

        // Check if subcategory already exists
        const existingSubCategory = await SubCategory.findOne({ name: name.trim() });
        if (existingSubCategory) {
            return res.status(400).json({ success: false, message: "Sub-category already exists" });
        }

        const subCategory = await SubCategory.create({ name, description });

        return res.status(201).json({
            success: true,
            message: "Sub-category created successfully",
            data: subCategory,
        });
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// =========================
// 🔹 Get All Subcategories
// =========================
export const getSubCategories = async (req, res) => {
    try {
        const subCategories = await SubCategory.find().sort({ createdAt: -1 });
        return res.status(200).json({ success: true, data: subCategories });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// =========================
// 🔹 Get Subcategory by ID
// =========================
export const getSubCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const subCategory = await SubCategory.findById(id);

        if (!subCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found" });
        }

        return res.status(200).json({ success: true, data: subCategory });
    } catch (error) {
        console.error("Error fetching subcategory:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// =========================
// 🔹 Update Subcategory
// =========================
export const updateSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedSubCategory = await SubCategory.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedSubCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Sub-category updated successfully",
            data: updatedSubCategory,
        });
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// =========================
// 🔹 Delete Subcategory
// =========================
export const deleteSubCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedSubCategory = await SubCategory.findByIdAndDelete(id);

        if (!deletedSubCategory) {
            return res.status(404).json({ success: false, message: "Sub-category not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Sub-category deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
