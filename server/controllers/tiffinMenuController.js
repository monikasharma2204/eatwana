import TiffinMenu from "../models/tiffinMenuModel.js";

// 📌 Helper function → Determine if menu contains Non-Veg
const detectMenuType = (week) => {
    for (const day of week) {
        const { Breakfast, Lunch, Dinner } = day.meals;

        const allMeals = [...Breakfast, ...Lunch, ...Dinner];

        if (allMeals.some(dish => dish.type === "Non-Veg")) {
            return "Includes-Non-Veg";
        }
    }
    return "Pure-Veg";
};

// --------------------------------------
// 📌 Add Menu
// --------------------------------------
export const addMenu = async (req, res) => {
    try {
        const { menuName, week } = req.body;

        if (!menuName || !week) {
            return res.status(400).json({
                success: false,
                message: "menuName and week are required",
            });
        }

        // Auto detect veg / non-veg
        const menuType = detectMenuType(week);

        const newMenu = await TiffinMenu.create({
            menuName,
            week,
            menuType,
        });

        return res.status(201).json({
            success: true,
            message: "Weekly menu created successfully",
            data: newMenu,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating menu",
            error: error.message,
        });
    }
};

// --------------------------------------
// 📌 Get All Menus
// --------------------------------------
export const getAllMenus = async (req, res) => {
    try {
        const menus = await TiffinMenu.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: menus,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching all menus",
            error: error.message,
        });
    }
};

// --------------------------------------
// 📌 Get Menu By ID
// --------------------------------------
export const getMenuById = async (req, res) => {
    try {
        const menu = await TiffinMenu.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: menu,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching menu",
            error: error.message,
        });
    }
};

// --------------------------------------
// 📌 Update Menu
// --------------------------------------
export const updateMenu = async (req, res) => {
    try {
        const { week, menuName } = req.body;

        const menu = await TiffinMenu.findById(req.params.id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found",
            });
        }

        // Update fields if provided
        if (menuName) menu.menuName = menuName;
        if (week) {
            menu.week = week;
            menu.menuType = detectMenuType(week);
        }

        await menu.save();

        return res.status(200).json({
            success: true,
            message: "Menu updated successfully",
            data: menu,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating menu",
            error: error.message,
        });
    }
};

// --------------------------------------
// 📌 Delete Menu
// --------------------------------------
export const deleteMenu = async (req, res) => {
    try {
        const menu = await TiffinMenu.findByIdAndDelete(req.params.id);

        if (!menu) {
            return res.status(404).json({
                success: false,
                message: "Menu not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Menu deleted successfully",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting menu",
            error: error.message,
        });
    }
};
