import React, { useEffect, useState } from 'react';
import { Star, Leaf, Drumstick, Sparkles, Dumbbell, Check } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { useNavigate, useParams } from 'react-router-dom';
import { RippleLoader } from '../../ui/Loader';
import { addToCart } from '../../services/cartAction';
import AlertSnackbar from '../../ui/AlertSnackbar';
import { useDispatch, useSelector } from 'react-redux';

const DishDetailPage = () => {
    const [selectedQuantity, setSelectedQuantity] = useState(null);
    const [loading, setLoading] = useState(true);
    const id = useParams().id;
    const [dish, setDish] = useState(null);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [addingToCart, setAddingToCart] = useState(false);

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
    const fetchDishData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get(`/api/v1/dishes/get/${id}`);
            setDish(response.data.data);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        fetchDishData();
    }, [])
    const handleQuantitySelect = (quantity) => {
        setSelectedQuantity(quantity);
    };

    const handleAddToCart = async () => {
        if (!user) {
            showSnackbar("Please login to add items to cart", "warning");
            navigate('/login');
            return;
        }

        if (!selectedQuantity) {
            showSnackbar('Please select a quantity', "info");
            return;
        }

        setAddingToCart(true);

        try {
            const cartData = {
                itemType: 'dish',
                dish: id,
                selectedQuantity: selectedQuantity.type, // e.g., "half", "full", "large"
                price: selectedQuantity.discountPrice,
                quantity: 1
            };

            const result = await dispatch(addToCart(cartData));

            if (result.success || result.payload?.success) {
                showSnackbar(result.message || result.payload?.message || 'Dish added to cart successfully!', "success");
                // Optionally navigate to cart page
                // navigate('/cart');
            } else {
                showSnackbar(result.message || result.payload?.message || 'Failed to add to cart', "warning");
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showSnackbar('Failed to add to cart', "error");
        } finally {
            setAddingToCart(false);
        }
    };
    const calculateSavings = () => {
        if (selectedQuantity) {
            return selectedQuantity?.price - selectedQuantity?.discountPrice;
        }
        return 0;
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, i) => (
            <Star
                key={i}
                size={18}
                className={i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
        ));
    };

    const getMealTypeIcon = (type) => {
        switch (type) {
            case 'special':
                return <Sparkles size={16} className="text-secondary" />;
            case 'gym':
                return <Dumbbell size={16} className="text-secondary" />;
            default:
                return null;
        }
    };

    const getMealTypeLabel = (type) => {
        switch (type) {
            case 'special':
                return 'Special';
            case 'gym':
                return 'Gym Meal';
            default:
                return 'Normal';
        }
    };
    if (loading) {
        return (
            <>
                <div className='flex items-center justify-center h-screen'>
                    <RippleLoader size={60} color='#e7582e' />
                </div>
            </>
        )
    }
    return (
        <>
            <AlertSnackbar
                open={snackbar.open}
                message={snackbar.message}
                severity={snackbar.severity}
                duration={8000}
                onClose={handleClose}
                position={{ vertical: "top", horizontal: "right" }}
            />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-6xl mx-auto p-4 md:p-8">

                    {/* Dish Header Section */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6">
                        <div className="flex flex-col md:flex-row">
                            {/* Image */}
                            <div className="md:w-1/2">
                                <img
                                    src={import.meta.env.VITE_API_URL + '/' + dish.image}
                                    alt={dish.name}
                                    className="w-full h-64 md:h-96 object-cover"
                                />
                            </div>

                            {/* Header Info */}
                            <div className="md:w-1/2 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-3">
                                    {/* Veg/Non-veg Indicator */}
                                    <div className={`w-6 h-6 border-2 flex items-center justify-center ${dish.category === 'veg' ? 'border-green-600' : 'border-red-600'
                                        }`}>
                                        <div className={`w-3 h-3 rounded-full ${dish.category === 'veg' ? 'bg-green-600' : 'bg-red-600'
                                            }`}></div>
                                    </div>

                                    {/* Meal Type Badge */}
                                    <span className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold rounded-full">
                                        {getMealTypeIcon(dish.mealType)}
                                        {getMealTypeLabel(dish.mealType)}
                                    </span>
                                </div>

                                <h1 className="text-3xl md:text-4xl font-bold text-primary mb-3">
                                    {dish.name}
                                </h1>

                                {/* Rating */}
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex gap-1">
                                        {renderStars(dish.rating)}
                                    </div>
                                    <span className="text-sm text-gray-600 font-medium">
                                        {dish.rating} / 5.0
                                    </span>
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2">
                                    {dish.tags.map((tag, index) => (
                                        <span
                                            key={index}
                                            className="px-3 py-1.5 bg-third/10 text-third text-sm font-medium rounded-full border border-third/20"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Availability Status */}
                                {!dish.isAvailable && (
                                    <div className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
                                        Currently Unavailable
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Dish Description Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                        <h2 className="text-2xl font-bold text-primary mb-4">About This Dish</h2>
                        <p className="text-gray-700 leading-relaxed text-lg">
                            {dish.description}
                        </p>
                    </div>

                    {/* Quantity Selection Section */}
                    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                        <h2 className="text-2xl font-bold text-primary mb-6">Select Quantity</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dish.quantities.map((quantity, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleQuantitySelect(quantity)}
                                    className={`relative border rounded-lg p-6 cursor-pointer transition-all duration-300 ${selectedQuantity?.type === quantity.type
                                        ? 'ring-2 ring-primary border-primary bg-primary/5 shadow-lg scale-[1.02]'
                                        : 'border-third/20 hover:shadow-lg hover:scale-[1.02] hover:border-primary/30'
                                        }`}
                                >
                                    {/* Selection Check */}
                                    {selectedQuantity?.type === quantity.type && (
                                        <div className="absolute top-4 right-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                            <Check size={16} className="text-white" />
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <h3 className="text-xl font-bold text-primary mb-1">
                                            {quantity.type} Plate
                                        </h3>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl font-bold text-secondary">
                                            ₹{quantity.discountPrice}
                                        </span>
                                        <span className="text-lg text-gray-400 line-through">
                                            ₹{quantity.price}
                                        </span>
                                        <span className="ml-auto px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                                            SAVE ₹{quantity.price - quantity.discountPrice}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price Summary & Add to Cart Section */}
                    {selectedQuantity && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-primary mb-4">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Selected:</span>
                                        <span className="font-semibold text-primary">{selectedQuantity.type} Plate</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Price:</span>
                                        <span className="text-2xl font-bold text-primary">₹{selectedQuantity.discountPrice}</span>
                                    </div>

                                    {calculateSavings() > 0 && (
                                        <div className="flex justify-between items-center pt-3 border-t border-third/20">
                                            <span className="text-green-600 font-medium">You Save:</span>
                                            <span className="text-xl font-bold text-green-600">₹{calculateSavings()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={!dish.isAvailable}
                                className={`w-full py-4 rounded-full font-bold text-lg shadow-lg transition-all duration-300 ${dish.isAvailable
                                    ? 'bg-gradient-to-r from-primary to-secondary text-white hover:scale-[1.03] hover:shadow-xl'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {dish.isAvailable ? 'Add to Cart' : 'Currently Unavailable'}
                            </button>
                        </div>
                    )}

                    {!selectedQuantity && (
                        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 text-center">
                            <p className="text-gray-500 text-lg">
                                Please select a quantity to proceed
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default DishDetailPage;