import { useState } from 'react';
import { Tag, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';

export default function SubCategoryForm() {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });
    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!formData.name.trim()) {
            showSnackbar('Sub-category name is required', 'warning');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosClient.post('/api/v1/subcategory/add', formData);

            // ✅ Success response (status 201)
            showSnackbar(response.data.message || 'Sub-category created successfully', 'success');
            setFormData({ name: '', description: '' });

        } catch (error) {
            console.error('Error creating sub-category:', error);

            if (error.response) {
                // Server responded with error status (400, 500, etc.)
                const { status, data } = error.response;
                const message = data?.message || 'Something went wrong on the server.';

                // Handle different status codes appropriately
                if (status === 400) {
                    // Client error (validation, duplicate, etc.) - Show WARNING
                    showSnackbar(message, 'warning');
                } else if (status >= 500) {
                    // Server error - Show ERROR
                    showSnackbar(message, 'error');
                } else {
                    // Other errors
                    showSnackbar(message, 'warning');
                }
            } else if (error.request) {
                // No response received from server
                showSnackbar('No response from server. Please check your connection.', 'error');
            } else {
                // Error setting up the request
                showSnackbar('Request error: ' + error.message, 'error');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
                    <div className="mb-8 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#e7582e' }}>
                            <Tag className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Sub-Category</h1>
                        <p className="text-gray-500">Add a new sub-category to your system</p>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Sub-Category Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Tag className="w-5 h-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all"
                                    style={{
                                        '--tw-ring-color': '#e7582e'
                                    }}
                                    placeholder="Enter sub-category name"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <div className="relative">
                                <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                                    <FileText className="w-5 h-5 text-gray-400" />
                                </div>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:outline-none transition-all resize-none"
                                    style={{
                                        '--tw-ring-color': '#e7582e'
                                    }}
                                    placeholder="Enter description (optional)"
                                />
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed hover:shadow-lg"
                            style={{
                                backgroundColor: loading ? '#125a69' : '#e7582e',
                                transform: loading ? 'scale(0.98)' : 'scale(1)'
                            }}
                            onMouseEnter={(e) => !loading && (e.target.style.backgroundColor = '#f27636')}
                            onMouseLeave={(e) => !loading && (e.target.style.backgroundColor = '#e7582e')}
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle2 className="w-5 h-5" />
                                    Create Sub-Category
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>

    );
}