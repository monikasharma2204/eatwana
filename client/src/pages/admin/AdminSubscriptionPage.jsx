import React, { useState, useEffect } from 'react';
import { Search, Edit2, Trash2, X, Calendar, Check, AlertCircle } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';



// Edit Subscription Modal
const EditSubscriptionModal = ({ subscription, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        status: subscription?.status || 'active',
        isActive: subscription?.isActive || false,
        startDate: subscription?.startDate || '',
        nextDelivery: subscription?.nextDelivery || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-lg">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Edit Subscription</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-4 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.isActive}
                                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                className="w-5 h-5 text-primary rounded focus:ring-primary"
                            />
                            <span className="text-sm font-medium text-gray-700">Active Subscription</span>
                        </label>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-4 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Next Delivery</label>
                        <input
                            type="date"
                            value={formData.nextDelivery}
                            onChange={(e) => setFormData({ ...formData, nextDelivery: e.target.value })}
                            className="w-full px-4 py-2 border border-third/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteConfirmationModal = ({ subscription, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-red-100 rounded-full">
                        <AlertCircle className="text-red-600" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">Delete Subscription</h3>
                </div>

                <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this subscription for <strong>{subscription?.user?.name}</strong>? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

// Main Component
const AdminSubscriptionPage = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [filteredSubscriptions, setFilteredSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [editingSubscription, setEditingSubscription] = useState(null);
    const [deletingSubscription, setDeletingSubscription] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    useEffect(() => {
        fetchSubscriptions();
    }, []);

    useEffect(() => {
        filterSubscriptions();
    }, [subscriptions, searchTerm, statusFilter]);

    const fetchSubscriptions = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/v1/subscription/all');
            setSubscriptions(response.data);
        } catch (error) {
            showSnackbar('Failed to fetch subscriptions', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterSubscriptions = () => {
        let filtered = [...subscriptions];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(sub => sub.status === statusFilter);
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(sub =>
                sub.user.name.toLowerCase().includes(term) ||
                sub.user.email.toLowerCase().includes(term) ||
                sub.user.phone.includes(term) ||
                sub.tiffin.name.toLowerCase().includes(term)
            );
        }

        setFilteredSubscriptions(filtered);
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleEdit = (subscription) => {
        setEditingSubscription(subscription);
    };

    const handleSaveEdit = async (formData) => {
        try {
            await axiosClient.put(`/api/v1/subscription/${editingSubscription._id}`, formData);

            setSubscriptions(prev =>
                prev.map(sub =>
                    sub._id === editingSubscription._id
                        ? { ...sub, ...formData }
                        : sub
                )
            );

            showSnackbar('Subscription updated successfully!', 'success');
            setEditingSubscription(null);
        } catch (error) {
            showSnackbar('Failed to update subscription', 'error');
        }
    };

    const handleDelete = (subscription) => {
        setDeletingSubscription(subscription);
    };

    const handleConfirmDelete = async () => {
        try {
            await axiosClient.delete(`/api/v1/subscription/${deletingSubscription._id}`);

            setSubscriptions(prev =>
                prev.filter(sub => sub._id !== deletingSubscription._id)
            );

            showSnackbar('Subscription deleted successfully!', 'success');
            setDeletingSubscription(null);
        } catch (error) {
            showSnackbar('Failed to delete subscription', 'error');
        }
    };

    const getStatusBadge = (status) => {
        const colors = {
            active: 'bg-green-100 text-green-800',
            paused: 'bg-yellow-100 text-yellow-800',
            expired: 'bg-gray-100 text-gray-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const getFoodTypeBadge = (foodType) => {
        const colors = {
            veg: 'bg-green-100 text-green-800 border-green-300',
            'non-veg': 'bg-red-100 text-red-800 border-red-300',
            egg: 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
        return (
            <span className={`px-2 py-1 rounded border text-xs font-medium ${colors[foodType]}`}>
                {foodType === 'non-veg' ? 'Non-Veg' : foodType.charAt(0).toUpperCase() + foodType.slice(1)}
            </span>
        );
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading subscriptions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                        Subscriptions
                    </h1>
                    <p className="text-gray-600">Manage all tiffin subscriptions</p>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by name, email, phone, or tiffin..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-2 border border-third/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-third/20 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden lg:block bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-third/20">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tiffin</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Plan & Price</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Active</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Dates</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredSubscriptions.map((sub) => (
                                    <tr key={sub._id} className="hover:bg-gray-50 transition">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-bold text-gray-900">{sub.user.name}</div>
                                                <div className="text-sm text-gray-600">{sub.user.email}</div>
                                                <div className="text-sm text-gray-500">{sub.user.phone}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-gray-900">{sub.tiffin.name}</div>
                                                <div className="mt-1">{getFoodTypeBadge(sub.tiffin.foodType)}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-semibold text-gray-900">₹{sub.price.toLocaleString()}</div>
                                                <div className="text-sm text-gray-600 capitalize">{sub.plan}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(sub.status)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {sub.isActive ? (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <Check size={14} /> Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1 w-fit">
                                                    <X size={14} /> Inactive
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Calendar size={14} />
                                                    <span>Start: {formatDate(sub.startDate)}</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-gray-600 mt-1">
                                                    <Calendar size={14} />
                                                    <span>Next: {formatDate(sub.nextDelivery)}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleEdit(sub)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                    title="Edit"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(sub)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile Card View */}
                <div className="lg:hidden space-y-4">
                    {filteredSubscriptions.map((sub) => (
                        <div key={sub._id} className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-lg">{sub.user.name}</h3>
                                    <p className="text-sm text-gray-600">{sub.user.email}</p>
                                    <p className="text-sm text-gray-500">{sub.user.phone}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(sub)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(sub)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-third/20 pt-4 space-y-3">
                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Tiffin</div>
                                    <div className="font-medium text-gray-900">{sub.tiffin.name}</div>
                                    <div className="mt-1">{getFoodTypeBadge(sub.tiffin.foodType)}</div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Plan</div>
                                        <div className="font-medium text-gray-900 capitalize">{sub.plan}</div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600 mb-1">Price</div>
                                        <div className="font-semibold text-gray-900">₹{sub.price.toLocaleString()}</div>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    {getStatusBadge(sub.status)}
                                    {sub.isActive ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <Check size={14} /> Active
                                        </span>
                                    ) : (
                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <X size={14} /> Inactive
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <div className="text-sm text-gray-600 mb-1">Dates</div>
                                    <div className="text-sm space-y-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>Start: {formatDate(sub.startDate)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-gray-400" />
                                            <span>Next: {formatDate(sub.nextDelivery)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredSubscriptions.length === 0 && (
                    <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                        <div className="text-gray-400 mb-4">
                            <Search size={48} className="mx-auto" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No subscriptions found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search term</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {editingSubscription && (
                <EditSubscriptionModal
                    subscription={editingSubscription}
                    onClose={() => setEditingSubscription(null)}
                    onSave={handleSaveEdit}
                />
            )}

            {deletingSubscription && (
                <DeleteConfirmationModal
                    subscription={deletingSubscription}
                    onClose={() => setDeletingSubscription(null)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                position={{ vertical: 'top', horizontal: 'right' }}
            />
        </div>
    );
};

export default AdminSubscriptionPage;