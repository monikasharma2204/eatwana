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

// UPDATE CUSTOMER
export const updateCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, mobile, email, address } = req.body;

        // Check if customer exists
        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        // Validate mobile number uniqueness
        if (mobile && mobile !== customer.mobile) {
            const existingMobile = await Customer.findOne({ mobile });
            if (existingMobile) {
                return res.status(400).json({
                    success: false,
                    message: "Mobile number is already registered."
                });
            }
        }

        // Validate email uniqueness
        if (email && email !== customer.email) {
            const existingEmail = await Customer.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Email ID is already registered."
                });
            }
        }

        // Update fields
        customer.name = name ?? customer.name;
        customer.mobile = mobile ?? customer.mobile;
        customer.email = email ?? customer.email;
        customer.address = address ?? customer.address;

        await customer.save();

        res.status(200).json({
            success: true,
            message: "Customer updated successfully",
            data: customer
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// DELETE CUSTOMER
export const deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;

        const customer = await Customer.findById(id);
        if (!customer) {
            return res.status(404).json({
                success: false,
                message: "Customer not found"
            });
        }

        await Customer.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Customer deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
