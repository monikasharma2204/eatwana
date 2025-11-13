import React, { useEffect, useState } from 'react';
import SubCategoryTable from '../../components/admin/SubCategoryTable';
import axiosClient from '../../services/axiosClient';
import { RippleLoader } from '../../ui/Loader';
import AlertSnackbar from '../../ui/AlertSnackbar';

export default function SubCategory() {
    const [loading, setLoading] = useState(true);
    const [subCategory, setSubCategory] = useState([]);
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
    useEffect(() => {
        fetchSubCategory();
    }, []);

    const fetchSubCategory = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/v1/subcategory/all');
            setSubCategory(response.data.data || []);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            // Call delete API endpoint
            await axiosClient.delete(`/api/v1/subcategory/delete/${id}`);

            // Update state by removing deleted item
            setSubCategory(prev => prev.filter(item => item._id !== id));

            showSnackbar('Sub-category deleted successfully', "success");

        } catch (error) {
            console.error('Error deleting subcategory:', error);
            showSnackbar('Failed to delete sub-category. Please try again.', "success");
        }
    };

    const handleEdit = async (id, updatedData) => {
        try {
            const response = await axiosClient.put(`/api/v1/subcategory/update/${id}`, updatedData);

            // Update state with updated item
            setSubCategory(prev =>
                prev.map(item =>
                    item._id === id ? { ...item, ...response.data.data } : item
                )
            );

            showSnackbar('Sub-category updated successfully', "success");

        } catch (error) {
            console.error('Error updating subcategory:', error);

            // Handle 404 specifically
            if (error.response && error.response.status === 404) {
                showSnackbar('Sub-category not found!', 'warning');
                return;
            }

            // Handle all other errors
            showSnackbar('Failed to update sub-category. Please try again.', 'error');
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
            {/* Loader */}
            {loading && (
                <div className='flex justify-center py-10'>
                    <RippleLoader size={60} color="#e7582e" />
                </div>
            )}

            {/* If not loading and no subcategory */}
            {!loading && subCategory.length === 0 && (
                <p className="text-center text-gray-500 py-10 text-lg">
                    No Sub-Category Found
                </p>
            )}

            {/* Show table only when subcategories exist */}
            {!loading && subCategory.length > 0 && (
                <SubCategoryTable
                    subCategories={subCategory}
                    onDelete={handleDelete}
                    onEdit={handleEdit}
                />
            )}
        </>
    );
}