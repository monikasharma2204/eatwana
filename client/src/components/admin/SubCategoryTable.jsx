import React, { useState } from 'react';
import { Pencil, Trash2, Plus, X, Save, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SubCategoryTable({ subCategories, onDelete, onEdit }) {
    const navigate = useNavigate();
    const [editForm, setEditForm] = useState({ name: '', description: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [currentSubCategory, setCurrentSubCategory] = useState(null);

    const handleEditClick = (subCat) => {
        setCurrentSubCategory(subCat);
        setEditForm({ name: subCat.name, description: subCat.description });
        setShowEditDialog(true);
    };

    const handleDeleteClick = (subCat) => {
        setCurrentSubCategory(subCat);
        setShowDeleteConfirm(true);
    };

    const handleDelete = () => {
        if (currentSubCategory) {
            onDelete(currentSubCategory._id);
            setShowDeleteConfirm(false);
            setCurrentSubCategory(null);
        }
    };

    const handleSaveEdit = () => {
        if (currentSubCategory && editForm.name.trim()) {
            onEdit(currentSubCategory._id, editForm);
            setShowEditDialog(false);
            setCurrentSubCategory(null);
            setEditForm({ name: '', description: '' });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8 flex justify-end items-center">
                    <button
                        onClick={() => navigate("/admin/sub-categories/add")}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-secondary transition-colors shadow-md"
                    >
                        <Plus size={20} />
                        Add New
                    </button>
                </div>

                {/* Delete Confirmation Dialog */}
                {showDeleteConfirm && currentSubCategory && (
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                            <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                                <AlertCircle className="w-8 h-8 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Sub-Category?</h3>
                            <p className="text-gray-600 text-center mb-2">
                                Are you sure you want to delete
                            </p>
                            <p className="text-lg font-bold text-primary text-center mb-6">
                                "{currentSubCategory.name}"
                            </p>
                            <p className="text-sm text-gray-500 text-center mb-6">
                                This action cannot be undone. All data will be permanently deleted.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setCurrentSubCategory(null);
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex-1 bg-red-500 text-white py-3.5 px-4 rounded-xl font-bold hover:bg-red-600 transition-all"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Edit Dialog */}
                {showEditDialog && currentSubCategory && (
                    <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                            <div className="flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-4">
                                <Pencil className="w-8 h-8 text-secondary" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Edit Sub-Category</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Update the information below
                            </p>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter sub-category name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Enter description (optional)"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowEditDialog(false);
                                        setCurrentSubCategory(null);
                                        setEditForm({ name: '', description: '' });
                                    }}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    disabled={!editForm.name.trim()}
                                    className="flex-1 bg-primary text-white py-3.5 px-4 rounded-xl font-bold hover:bg-secondary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sub-Categories List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-third text-white">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Name</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Description</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold">Updated</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {subCategories.map((subCat) => (
                                    <tr key={subCat._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {subCat.name}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
                                            {subCat.description || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(subCat.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {formatDate(subCat.updatedAt)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button
                                                    onClick={() => handleEditClick(subCat)}
                                                    className="p-2 bg-secondary text-white rounded-lg hover:bg-primary transition-colors"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(subCat)}
                                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
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

                    {subCategories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            <p className="text-lg">No sub-categories found</p>
                            <p className="text-sm mt-2">Click "Add New" to create your first sub-category</p>
                        </div>
                    )}
                </div>

                {/* Stats Footer */}
                <div className="mt-6 bg-white rounded-lg shadow-md p-4">
                    <p className="text-gray-600">
                        Total Sub-Categories: <span className="font-semibold text-primary">{subCategories.length}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}