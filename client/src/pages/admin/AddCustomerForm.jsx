import { useState } from 'react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

// Mock implementations for demonstration


export default function AddCustomerForm() {
    const [formData, setFormData] = useState({
        name: '',
        mobile: '',
        email: '',
        address: ''
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [loading, setLoading] = useState(false);

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
        setTimeout(() => {
            setSnackbar(prev => ({ ...prev, open: false }));
        }, 8000);
    };

    const handleClose = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        // Name validation
        if (!formData.name.trim()) {
            showSnackbar("Name is required", "error");
            return false;
        }

        // Mobile validation - 10 digits
        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData.mobile)) {
            showSnackbar("Mobile number must be 10 digits", "error");
            return false;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            showSnackbar("Please enter a valid email address", "error");
            return false;
        }

        // Address validation
        if (!formData.address.trim()) {
            showSnackbar("Address is required", "error");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const response = await axiosClient.post("/api/v1/customer/create", {
                name: formData.name,
                mobile: formData.mobile,
                email: formData.email,
                address: formData.address
            });

            showSnackbar("Customer created successfully", "success");

            // Clear form fields
            setFormData({
                name: '',
                mobile: '',
                email: '',
                address: ''
            });
        } catch (error) {
            showSnackbar(
                error.response?.data?.message || "Something went wrong",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-10 px-4">
            <div className="max-w-lg mx-auto">
                <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-200">
                    <h2 className="text-primary text-2xl font-bold mb-6">Add New Customer</h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-third font-medium mb-1">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none transition"
                            />
                        </div>

                        {/* Mobile Number */}
                        <div>
                            <label htmlFor="mobile" className="block text-third font-medium mb-1">
                                Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="mobile"
                                name="mobile"
                                value={formData.mobile}
                                onChange={handleChange}
                                placeholder="10 digit mobile number"
                                maxLength="10"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-third font-medium mb-1">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="example@email.com"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none transition"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label htmlFor="address" className="block text-third font-medium mb-1">
                                Address <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Enter complete address"
                                rows="3"
                                className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-primary focus:outline-none transition resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-primary text-white w-full py-2.5 rounded-lg hover:scale-[1.02] transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Add Customer'
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />

            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
}