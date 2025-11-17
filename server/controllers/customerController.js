import Customer from "../models/customerModel.js";

export const createCustomer = async (req, res) => {
    try {
        const { name, mobile, email, address } = req.body;

        // Check mobile number uniqueness
        const existingMobile = await Customer.findOne({ mobile });
        if (existingMobile) {
            return res.status(400).json({
                success: false,
                message: "Mobile number is already registered."
            });
        }

        // Check email uniqueness (only if email provided)
        if (email) {
            const existingEmail = await Customer.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email ID is already registered."
                });
            }
        }

        const customer = await Customer.create({
            name,
            mobile,
            email,
            address
        });

        res.status(201).json({
            success: true,
            message: "Customer created successfully",
            data: customer
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


export const getAllCustomers = async (req, res) => {
    try {
        const customers = await Customer.find();

        res.json({
            success: true,
            data: customers
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
