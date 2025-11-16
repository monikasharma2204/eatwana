import Enquiry from "../models/enquiryModel.js";

// CREATE ENQUIRY
export const createEnquiry = async (req, res) => {
    try {
        const { name, email, mobile, message } = req.body;

        if (!name || !email || !mobile || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const enquiry = await Enquiry.create({
            name,
            email,
            mobile,
            message
        });

        res.status(201).json({
            message: "Enquiry submitted successfully",
            enquiry
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to submit enquiry",
            error: error.message
        });
    }
};

// GET ALL ENQUIRIES
export const getAllEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.json(enquiries);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch enquiries",
            error: error.message
        });
    }
};

// GET SINGLE ENQUIRY
export const getEnquiryById = async (req, res) => {
    try {
        const enquiry = await Enquiry.findById(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.json(enquiry);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch enquiry",
            error: error.message
        });
    }
};

// DELETE ENQUIRY
export const deleteEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndDelete(req.params.id);

        if (!enquiry) {
            return res.status(404).json({ message: "Enquiry not found" });
        }

        res.json({ message: "Enquiry deleted successfully" });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete enquiry",
            error: error.message
        });
    }
};
