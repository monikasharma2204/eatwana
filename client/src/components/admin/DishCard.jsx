
import React, { useState } from 'react';
import { Star, Edit2, Trash2, AlertCircle, Package, Clock, Tag, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DishCard = ({ dish, onDelete }) => {
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const navigate = useNavigate();

    const currentDish = dish;

    const getCategoryColor = () => {
        return currentDish.category === 'veg' ? 'bg-green-500' : 'bg-red-500';
    };

    const getCategoryText = () => {
        return currentDish.category === 'veg' ? 'Vegetarian' : 'Non-Vegetarian';
    };

    const getMealTypeBadge = () => {
        const badges = {
            normal: { text: 'Normal', color: 'bg-gray-500' },
            special: { text: 'Special', color: 'bg-secondary' },
            gym: { text: 'Gym', color: 'bg-third' }
        };
        return badges[currentDish.mealType] || badges.normal;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const handleDelete = () => {
        if (onDelete) {
            onDelete(currentDish._id);
        }
        setShowDeleteConfirm(false);
    };

    return (
        <>
            <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
                <div className="flex flex-col md:flex-row">
                    {/* Left Section - Image */}
                    <div className="relative md:w-80 lg:w-96 shrink-0">
                        <div className="h-64 md:h-full overflow-hidden bg-gray-100">
                            <img
                                src={currentDish.image}
                                alt={currentDish.name}
                                className="w-full h-full object-cover"
                            />

                            {/* Availability Overlay */}
                            {!currentDish.isAvailable && (
                                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center">
                                    <div className="text-center">
                                        <Package className="w-12 h-12 text-white mx-auto mb-2" />
                                        <span className="text-white text-lg font-bold">Unavailable</span>
                                    </div>
                                </div>
                            )}

                            {/* Top Badges */}
                            <div className="absolute top-4 left-4 right-4 flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <span className={`${getCategoryColor()} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg uppercase`}>
                                        {getCategoryText()}
                                    </span>
                                    <span className={`${getMealTypeBadge().color} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg`}>
                                        {getMealTypeBadge().text}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-lg shadow-lg">
                                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                                        <span className="text-sm font-bold text-gray-900">{currentDish.rating}</span>
                                    </div>
                                    <span className={`${currentDish.isAvailable ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg flex items-center gap-1.5`}>
                                        <div className={`w-2 h-2 rounded-full ${currentDish.isAvailable ? 'bg-green-200' : 'bg-red-200'} animate-pulse`} />
                                        {currentDish.isAvailable ? 'Available' : 'Unavailable'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Section - Details */}
                    <div className="flex-1 p-5 lg:p-6">
                        <div className="h-full flex flex-col">
                            {/* Header Info */}
                            <div className="mb-4">
                                <h3 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-2">
                                    {currentDish.name}
                                </h3>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <Info className="w-3.5 h-3.5" />
                                    <span className="font-mono">ID: {currentDish._id}</span>
                                </div>
                            </div>

                            {/* Category Info Grid */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="text-xs text-gray-500 mb-1 font-semibold">Category</div>
                                    <div className="text-sm font-bold text-gray-900">{getCategoryText()}</div>
                                </div>
                                {currentDish.subCategory && (
                                    <div className="bg-gray-50 rounded-lg p-3">
                                        <div className="text-xs text-gray-500 mb-1 font-semibold">Sub-Category</div>
                                        <div className="text-sm font-bold text-gray-900">{currentDish.subCategory.name}</div>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            {currentDish.description && (
                                <div className="mb-4 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                    <div className="text-xs text-blue-700 mb-1 font-semibold">Description</div>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {currentDish.description}
                                    </p>
                                </div>
                            )}

                            {/* Tags */}
                            {currentDish.tags && currentDish.tags.length > 0 && (
                                <div className="mb-4">
                                    <div className="text-xs text-gray-600 mb-2 font-semibold flex items-center gap-1">
                                        <Tag className="w-3.5 h-3.5" />
                                        Tags
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {currentDish.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="bg-primary bg-opacity-10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold border border-primary border-opacity-20"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Pricing Section - Horizontal Layout */}
                            <div className="mb-4 flex-1">
                                <div className="text-xs text-gray-600 mb-2 font-semibold">Pricing & Quantities</div>
                                <div className="bg-linear-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3">
                                        {currentDish.quantities.map((qty, index) => {
                                            const hasDiscount = qty.discountPrice > 0 && qty.discountPrice < qty.price;
                                            const discountPercent = hasDiscount
                                                ? Math.round(((qty.price - qty.discountPrice) / qty.price) * 100)
                                                : 0;

                                            return (
                                                <div key={index} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 relative">
                                                    {hasDiscount && (
                                                        <span className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-0.5 rounded-md text-xs font-bold shadow-md">
                                                            -{discountPercent}%
                                                        </span>
                                                    )}
                                                    <div className="text-center">
                                                        <div className="bg-third bg-opacity-10 text-white font-bold text-sm px-3 py-1.5 rounded-lg mb-2">
                                                            {qty.type}
                                                        </div>
                                                        {hasDiscount ? (
                                                            <div className="space-y-1">
                                                                <div className="text-xl font-bold text-primary">
                                                                    ₹{qty.discountPrice}
                                                                </div>
                                                                <div className="text-xs text-gray-400 line-through">
                                                                    ₹{qty.price}
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="text-xl font-bold text-gray-900">
                                                                ₹{qty.price}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Section - Timestamps and Actions */}
                            <div className="mt-auto">
                                {/* Timestamps */}
                                <div className="mb-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                            <div className="text-gray-500 mb-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Created
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                {formatDate(currentDish.createdAt)}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-gray-500 mb-1 flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                Updated
                                            </div>
                                            <div className="font-semibold text-gray-900">
                                                {formatDate(currentDish.updatedAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => navigate(`/admin/dishes/update/${dish._id}`)}
                                        className="flex-1 bg-third text-white py-3.5 px-4 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg text-sm"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>Edit Dish</span>
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="bg-red-500 text-white py-3.5 px-5 rounded-xl font-bold hover:bg-red-600 transition-all flex items-center justify-center shadow-md hover:shadow-lg"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-600/50 bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">Delete Dish?</h3>
                        <p className="text-gray-600 text-center mb-2">
                            Are you sure you want to delete
                        </p>
                        <p className="text-lg font-bold text-primary text-center mb-6">
                            "{currentDish.name}"
                        </p>
                        <p className="text-sm text-gray-500 text-center mb-6">
                            This action cannot be undone. All pricing information and data will be permanently deleted.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
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
        </>
    );
};
export default DishCard;
// Demo Component
const DishCardDemo = () => {
    const handleEdit = (dish) => {
        console.log('Edit dish:', dish);
        alert(`Editing: ${dish.name}`);
    };

    const handleDelete = (dishId) => {
        console.log('Delete dish:', dishId);
        alert(`Dish deleted successfully!`);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 text-center">
                    Dish Card Component
                </h1>
                <p className="text-gray-600 text-center mb-8">
                    Modern, elegant, and mobile-friendly design
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <DishCard
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <DishCard
                        dish={{
                            _id: '2',
                            name: 'Chicken Biryani',
                            image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&h=300&fit=crop',
                            rating: 4.8,
                            category: 'non-veg',
                            mealType: 'normal',
                            quantities: [
                                { type: 'Half', price: 200, discountPrice: 0 },
                                { type: 'Full', price: 350, discountPrice: 0 }
                            ],
                            isAvailable: true,
                            description: 'Aromatic basmati rice with succulent chicken pieces',
                            tags: ['Biryani', 'Spicy', 'Best Seller']
                        }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                    <DishCard
                        dish={{
                            _id: '3',
                            name: 'Grilled Chicken Salad',
                            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
                            rating: 4.3,
                            category: 'non-veg',
                            mealType: 'gym',
                            quantities: [
                                { type: 'Regular', price: 250, discountPrice: 200 }
                            ],
                            isAvailable: false,
                            description: 'High protein grilled chicken with fresh greens',
                            tags: ['Healthy', 'Low Carb']
                        }}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
};

