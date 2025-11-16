import React, { useState, useEffect } from 'react';
import { Search, Eye, Trash2, X, Copy, Check } from 'lucide-react';
import axiosClient from '../../services/axiosClient';

// Mock axiosClient - replace with your actual implementation


// AlertSnackbar Component
const AlertSnackbar = ({ open, message, severity, duration, onClose, position }) => {
    useEffect(() => {
        if (open) {
            const timer = setTimeout(onClose, duration);
            return () => clearTimeout(timer);
        }
    }, [open, duration, onClose]);

    if (!open) return null;

    const severityColors = {
        success: 'bg-green-500',
        error: 'bg-red-500',
        warning: 'bg-yellow-500',
        info: 'bg-blue-500'
    };

    return (
        <div className={`fixed ${position.vertical}-4 ${position.horizontal}-4 z-50 animate-slide-in`}>
            <div className={`${severityColors[severity]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3`}>
                <span>{message}</span>
                <button onClick={onClose} className="hover:opacity-80">
                    <X size={18} />
                </button>
            </div>
        </div>
    );
};

// View Enquiry Modal
const ViewEnquiryModal = ({ enquiry, onClose }) => {
    if (!enquiry) return null;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl animate-scale-in">
                <div className="flex items-center justify-between p-6 border-b border-third/20">
                    <h2 className="text-2xl font-bold text-primary">Enquiry Details</h2>
                    <button
                        onClick={onClose}
                        className="text-third hover:text-primary transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="text-sm font-semibold text-third uppercase tracking-wide">Name</label>
                        <p className="text-lg text-primary mt-1">{enquiry.name}</p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-third uppercase tracking-wide">Email</label>
                        <p className="text-lg text-primary mt-1">{enquiry.email}</p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-third uppercase tracking-wide">Mobile</label>
                        <p className="text-lg text-primary mt-1">{enquiry.mobile}</p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-third uppercase tracking-wide">Message</label>
                        <p className="text-base text-third mt-1 leading-relaxed">{enquiry.message}</p>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-third uppercase tracking-wide">Submitted On</label>
                        <p className="text-base text-primary mt-1">{formatDate(enquiry.createdAt)}</p>
                    </div>
                </div>

                <div className="p-6 border-t border-third/20">
                    <button
                        onClick={onClose}
                        className="w-full bg-primary text-white py-3 rounded-full hover:bg-primary/90 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmModal = ({ enquiry, onConfirm, onClose }) => {
    if (!enquiry) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full shadow-2xl animate-scale-in">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-primary mb-4">Delete Enquiry</h2>
                    <p className="text-third mb-6">
                        Are you sure you want to delete the enquiry from <span className="font-semibold text-primary">{enquiry.name}</span>? This action cannot be undone.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 border border-third/30 text-third py-3 rounded-full hover:bg-third/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => onConfirm(enquiry._id)}
                            className="flex-1 bg-red-500 text-white py-3 rounded-full hover:bg-red-600 transition-colors font-medium"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Copy to Clipboard Button
const CopyButton = ({ text }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className="ml-2 text-third hover:text-primary transition-colors inline-flex items-center"
            title="Copy to clipboard"
        >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
        </button>
    );
};

// Enquiry Row Component
const EnquiryRow = ({ enquiry, onView, onDelete }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const truncateMessage = (text, maxLength = 35) => {
        return text?.length > maxLength ? text?.substring(0, maxLength) + '...' : text;
    };

    return (
        <>
            {/* Desktop Row */}
            <tr className="border-b border-third/10 hover:bg-third/5 transition-colors hidden md:table-row">
                <td className="px-6 py-4">
                    <span className="font-semibold text-primary">{enquiry.name}</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-third flex items-center">
                        {enquiry.email}
                        <CopyButton text={enquiry.email} />
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-third flex items-center">
                        {enquiry.mobile}
                        <CopyButton text={enquiry.mobile} />
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-third">{truncateMessage(enquiry.message)}</span>
                </td>
                <td className="px-6 py-4">
                    <span className="text-third text-sm">{formatDate(enquiry.createdAt)}</span>
                </td>
                <td className="px-6 py-4">
                    <div className="flex gap-2">
                        <button
                            onClick={() => onView(enquiry)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="View Details"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(enquiry)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </td>
            </tr>

            {/* Mobile Card */}
            <div className="md:hidden border border-third/20 rounded-xl p-4 mb-4 bg-white shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h3 className="font-bold text-primary text-lg">{enquiry.name}</h3>
                        <p className="text-sm text-third mt-1">{formatDate(enquiry.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onView(enquiry)}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                        >
                            <Eye size={18} />
                        </button>
                        <button
                            onClick={() => onDelete(enquiry)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <span className="text-third">{enquiry.email}</span>
                        <CopyButton text={enquiry.email} />
                    </div>
                    <div className="flex items-center text-sm">
                        <span className="text-third">{enquiry.mobile}</span>
                        <CopyButton text={enquiry.mobile} />
                    </div>
                    <p className="text-sm text-third mt-2">{truncateMessage(enquiry.message, 60)}</p>
                </div>
            </div>
        </>
    );
};

// Main Admin Enquiries Page
const Enquiries = () => {
    const [enquiries, setEnquiries] = useState([]);
    const [filteredEnquiries, setFilteredEnquiries] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedEnquiry, setSelectedEnquiry] = useState(null);
    const [enquiryToDelete, setEnquiryToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchEnquiries();
    }, []);

    useEffect(() => {
        filterEnquiries();
    }, [searchTerm, enquiries]);

    const fetchEnquiries = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/api/v1/enquiry/all');
            setEnquiries(res.data);
            setFilteredEnquiries(res.data);
        } catch (error) {
            showSnackbar('Failed to fetch enquiries', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterEnquiries = () => {
        if (!searchTerm.trim()) {
            setFilteredEnquiries(enquiries);
            return;
        }

        const filtered = enquiries.filter(enquiry =>
            enquiry.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            enquiry.mobile.includes(searchTerm)
        );
        setFilteredEnquiries(filtered);
    };

    const handleDelete = async (enquiryId) => {
        try {
            await axiosClient.delete(`/api/v1/enquiry/${enquiryId}`);
            setEnquiries(enquiries.filter(e => e._id !== enquiryId));
            showSnackbar('Enquiry deleted successfully!', 'success');
            setEnquiryToDelete(null);
        } catch (error) {
            showSnackbar('Failed to delete enquiry', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Enquiries</h1>
                    <p className="text-third text-lg">View all customer enquiries</p>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-third" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, email, or phone..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-third/20 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden md:block bg-white rounded-xl shadow-md border border-third/20 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-third/5 border-b border-third/20">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wider">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wider">Mobile</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wider">Message</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wider">Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-primary uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredEnquiries?.length > 0 ? (
                                            filteredEnquiries?.map((enquiry) => (
                                                <EnquiryRow
                                                    key={enquiry._id}
                                                    enquiry={enquiry}
                                                    onView={setSelectedEnquiry}
                                                    onDelete={setEnquiryToDelete}
                                                />
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-12 text-center text-third">
                                                    No enquiries found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="md:hidden">
                            {filteredEnquiries?.length > 0 ? (
                                filteredEnquiries?.map((enquiry) => (
                                    <EnquiryRow
                                        key={enquiry._id}
                                        enquiry={enquiry}
                                        onView={setSelectedEnquiry}
                                        onDelete={setEnquiryToDelete}
                                    />
                                ))
                            ) : (
                                <div className="bg-white rounded-xl p-8 text-center text-third shadow-sm">
                                    No enquiries found
                                </div>
                            )}
                        </div>

                        {/* Results Count */}
                        <div className="mt-4 text-center text-sm text-third">
                            Showing {filteredEnquiries?.length} of {enquiries?.length} enquiries
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedEnquiry && (
                <ViewEnquiryModal
                    enquiry={selectedEnquiry}
                    onClose={() => setSelectedEnquiry(null)}
                />
            )}

            {enquiryToDelete && (
                <DeleteConfirmModal
                    enquiry={enquiryToDelete}
                    onConfirm={handleDelete}
                    onClose={() => setEnquiryToDelete(null)}
                />
            )}

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleCloseSnackbar}
                position={{ vertical: 'top', horizontal: 'right' }}
            />

            <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }

        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
        </div>
    );
};

export default Enquiries;