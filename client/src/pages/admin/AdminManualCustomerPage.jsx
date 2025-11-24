import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, X, Loader2, Users } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import AlertSnackbar from '../../ui/AlertSnackbar';


// Edit Customer Modal
const EditCustomerModal = ({ customer, onClose, onUpdate, showSnackbar }) => {
    const [formData, setFormData] = useState({
        name: customer.name,
        mobile: customer.mobile,
        email: customer.email,
        address: customer.address,
        tokenBalance: customer.tokenBalance
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'tokenBalance' ? Number(value) : value
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            await axiosClient.put(`/api/v1/customer/update/${customer._id}`, formData);
            showSnackbar('Customer updated successfully', 'success');
            onUpdate();
            onClose();
        } catch (error) {
            showSnackbar('Failed to update customer', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-primary">Edit Customer</h2>
                    <button onClick={onClose} className="text-third hover:text-primary transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-third mb-2">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-third/20 rounded-lg px-4 py-2 w-full focus:ring-2 ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-third mb-2">Mobile</label>
                        <input
                            type="text"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            className="border border-third/20 rounded-lg px-4 py-2 w-full focus:ring-2 ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-third mb-2">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="border border-third/20 rounded-lg px-4 py-2 w-full focus:ring-2 ring-primary outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-third mb-2">Address</label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            rows="3"
                            className="border border-third/20 rounded-lg px-4 py-2 w-full focus:ring-2 ring-primary outline-none resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-third mb-2">Token Balance</label>
                        <input
                            type="number"
                            name="tokenBalance"
                            value={formData.tokenBalance}
                            onChange={handleChange}
                            min="0"
                            className="border border-third/20 rounded-lg px-4 py-2 w-full focus:ring-2 ring-primary outline-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            onClick={onClose}
                            className="flex-1 bg-third/10 text-third px-4 py-2 rounded-lg hover:bg-third/20 transition"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:scale-[1.02] transition disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? <><Loader2 size={18} className="animate-spin" /> Updating...</> : 'Update'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Delete Confirmation Modal
const DeleteCustomerModal = ({ customer, onClose, onDelete, showSnackbar }) => {
    const [loading, setLoading] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await axiosClient.delete(`/api/v1/customer/delete/${customer._id}`);
            showSnackbar('Customer deleted successfully', 'success');
            onDelete();
            onClose();
        } catch (error) {
            showSnackbar('Failed to delete customer', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-40 p-4">
            <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-600">Delete Customer</h2>
                    <button onClick={onClose} className="text-third hover:text-primary transition">
                        <X size={24} />
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-third mb-2">Are you sure you want to delete this customer?</p>
                    <p className="text-sm text-red-500 font-medium">This action is irreversible.</p>
                    <div className="mt-4 p-3 bg-third/5 rounded-lg">
                        <p className="font-semibold text-primary">{customer.name}</p>
                        <p className="text-sm text-third">{customer.email}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 bg-third/10 text-third px-4 py-2 rounded-lg hover:bg-third/20 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        disabled={loading}
                        className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? <><Loader2 size={18} className="animate-spin" /> Deleting...</> : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

// Customer Row (Desktop)
const CustomerRow = ({ customer, onEdit, onDelete }) => {
    return (
        <tr className="border-b border-third/20 hover:bg-third/5 transition">
            <td className="px-6 py-4 whitespace-nowrap flex flex-col ">
                <span className="font-medium text-primary">{customer.name}</span>
                <span className="text-xs text-third">{customer.mobile}</span>
                <span className="text-xs text-third">{customer.email}</span>
            </td>

            <td className="px-6 py-4 text-third">
                <div className="max-w-xs truncate">{customer.address}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {customer.tokenBalance}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                {customer.activePlan ? (
                    <span className="text-green-600 font-medium">Active</span>
                ) : (
                    <span className="text-red-500 text-sm">No Active Plan</span>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(customer)}
                        className="bg-primary text-white px-3 py-1 rounded-lg hover:scale-[1.02] transition flex items-center gap-1"
                    >
                        <Edit2 size={14} />
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(customer)}
                        className="bg-red-500 text-white px-3 py-1 rounded-lg hover:scale-[1.02] transition flex items-center gap-1"
                    >
                        <Trash2 size={14} />
                        Delete
                    </button>
                </div>
            </td>
        </tr>
    );
};

// Customer Card (Mobile)
const CustomerCard = ({ customer, onEdit, onDelete }) => {
    return (
        <div className="border border-third/20 rounded-xl p-4 shadow bg-white space-y-3">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-bold text-primary">{customer.name}</h3>
                    <p className="text-sm text-third">{customer.mobile}</p>
                </div>
                {customer.activePlan ? (
                    <span className="text-green-600 font-medium text-sm">Active</span>
                ) : (
                    <span className="text-red-500 text-xs">No Plan</span>
                )}
            </div>

            <div className="space-y-1">
                <p className="text-sm text-third">{customer.email}</p>
                <p className="text-sm text-third">{customer.address}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-third/20">
                <div>
                    <span className="text-xs text-third">Token Balance</span>
                    <p className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium inline-block ml-2">
                        {customer.tokenBalance}
                    </p>
                </div>
            </div>

            <div className="flex gap-2 pt-2">
                <button
                    onClick={() => onEdit(customer)}
                    className="flex-1 bg-primary text-white px-3 py-2 rounded-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
                >
                    <Edit2 size={16} />
                    Edit
                </button>
                <button
                    onClick={() => onDelete(customer)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-lg hover:scale-[1.02] transition flex items-center justify-center gap-2"
                >
                    <Trash2 size={16} />
                    Delete
                </button>
            </div>
        </div>
    );
};

// Main Admin Customer Page
const AdminManualCustomerPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [deletingCustomer, setDeletingCustomer] = useState(null);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const response = await axiosClient.get('/api/v1/customer/all');
            console.log(response)
            setCustomers(response.data.data || []);
        } catch (error) {
            showSnackbar('Failed to load customers', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
    };

    const handleDelete = (customer) => {
        setDeletingCustomer(customer);
    };

    const handleUpdate = () => {
        fetchCustomers();
    };

    const handleDeleteConfirm = () => {
        fetchCustomers();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-third/5 to-primary/5 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <Users className="text-primary" size={32} />
                        <h1 className="text-3xl md:text-4xl font-bold text-primary">Customer Management</h1>
                    </div>
                    <p className="text-third">Manage all registered customers and their details</p>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin text-primary" size={48} />
                    </div>
                ) : (
                    <>
                        {/* Desktop Table */}
                        <div className="hidden lg:block rounded-xl shadow border border-third/20 bg-white overflow-hidden">
                            <div className="overflow-x-auto max-w-full">
                                <table className="w-full min-w-[1000px]">
                                    <thead className="bg-primary text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Personal Details</th>
                                            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Address</th>
                                            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Token Balance</th>
                                            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Active Plan</th>
                                            <th className="px-6 py-4 text-left font-semibold whitespace-nowrap">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="text-center py-12 text-third">
                                                    No customers found
                                                </td>
                                            </tr>
                                        ) : (
                                            customers.map(customer => (
                                                <CustomerRow
                                                    key={customer._id}
                                                    customer={customer}
                                                    onEdit={handleEdit}
                                                    onDelete={handleDelete}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Cards */}
                        <div className="lg:hidden space-y-4">
                            {customers.length === 0 ? (
                                <div className="text-center py-12 text-third bg-white rounded-xl border border-third/20">
                                    No customers found
                                </div>
                            ) : (
                                customers.map(customer => (
                                    <CustomerCard
                                        key={customer._id}
                                        customer={customer}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}
                                    />
                                ))
                            )}
                        </div>

                        {/* Stats */}
                        <div className="mt-6 bg-white rounded-xl border border-third/20 p-4 shadow">
                            <p className="text-third text-sm">
                                Total Customers: <span className="font-bold text-primary">{customers.length}</span>
                            </p>
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {editingCustomer && (
                <EditCustomerModal
                    customer={editingCustomer}
                    onClose={() => setEditingCustomer(null)}
                    onUpdate={handleUpdate}
                    showSnackbar={showSnackbar}
                />
            )}

            {deletingCustomer && (
                <DeleteCustomerModal
                    customer={deletingCustomer}
                    onClose={() => setDeletingCustomer(null)}
                    onDelete={handleDeleteConfirm}
                    showSnackbar={showSnackbar}
                />
            )}

            {/* Snackbar */}
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={4000}
                onClose={handleCloseSnackbar}
                position={{ vertical: 'top', horizontal: 'right' }}
            />

            <style>{`
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
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default AdminManualCustomerPage;