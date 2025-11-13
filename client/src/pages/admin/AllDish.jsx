import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../ui/Breadcrumb';
import DishCard from '../../components/admin/DishCard';
import { ChevronRight } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { RippleLoader } from '../../ui/Loader';

export default function AllDish() {
    const [loading, setLoading] = useState(true);
    const [dishes, setDishes] = useState([]);
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
        const fetchDishes = async () => {
            try {
                setLoading(true); // start loader

                const response = await axiosClient.get('/api/v1/dishes/all');
                setDishes(response.data.data || []);
            } catch (error) {
                console.error('Error fetching dishes:', error);
            } finally {
                setLoading(false); // stop loader
            }
        };

        fetchDishes();
    }, []);


    const handleEdit = (dish) => {
        console.log('Edit dish:', dish);
        alert(`Editing: ${dish.name}`);
    };

    const handleDelete = async (dishId) => {
        try {
            const response = await axiosClient.delete(`/api/v1/dishes/delete/${dishId}`);

            if (response.data.success) {
                // Remove deleted dish from UI
                setTimeout(() => {
                    showSnackbar("Dish Deleted", "success");
                }, 2000);
                setDishes((prev) => prev.filter((item) => item._id !== dishId));

            } else {
                showSnackbar("Failed to delete dish", "error");
            }
        } catch (error) {
            console.error("Error deleting dish:", error);
            showSnackbar("Something went wrong while deleting", "error");
        }
    };
    if (loading) {
        return (
            <>
                <Breadcrumb
                    items={[{ label: 'All Dishes' }]}
                    showHome={true}
                    homeIcon={true}
                    separator={<ChevronRight size={15} />}
                />

                <div className="flex items-center justify-center h-screen">
                    <RippleLoader size={60} color="#e7582e" />
                </div>
            </>
        );
    }
    return (
        <>
            <Breadcrumb
                items={[{ label: 'All Dishes' }]}
                showHome={true}
                homeIcon={true}
                separator={<ChevronRight size={15} />}
            />

            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-4 sm:p-6 md:p-8">
                <div className="max-w-7xl mx-auto space-y-6">
                    {dishes.length > 0 ? (
                        dishes.map((dish) => (
                            <DishCard
                                key={dish._id}
                                dish={{
                                    _id: dish._id,
                                    name: dish.name,
                                    image: dish.image
                                        ? `http://localhost:3000/${dish.image}` // ✅ convert uploads\path → uploads/path
                                        : '/no-image.jpg',
                                    rating: dish.rating || 0,
                                    category: dish.category,
                                    mealType: dish.mealType,
                                    quantities: dish.quantities,
                                    isAvailable: dish.isAvailable,
                                    description: dish.description,
                                    tags: dish.tags,
                                    subCategory: dish.subCategory,
                                    createdAt: dish.createdAt,
                                    updatedAt: dish.updatedAt,
                                }}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        <div className="text-center text-gray-500 py-10">
                            No dishes found.
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}
