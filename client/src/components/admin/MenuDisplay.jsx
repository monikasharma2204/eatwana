import React, { useState } from 'react';
import { Trash2, Edit2, ChevronDown, ChevronUp, Calendar, Utensils, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MenuDisplay = ({ menus, onDelete }) => {
    const [expandedMenus, setExpandedMenus] = useState({});
    const [expandedDays, setExpandedDays] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [currentMenu, setCurrentMenu] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const toggleDay = (menuId, day) => {
        const key = `${menuId}-${day}`;
        setExpandedDays(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleDeleteClick = (menu) => {
        setCurrentMenu(menu);
        setShowDeleteConfirm(true);
    };


    const handleDelete = async () => {
        if (!currentMenu) return;

        try {
            setDeleteLoading(true); // 🔥 Start loading
            await onDelete(currentMenu._id); // 🔥 Wait parent API
            setShowDeleteConfirm(false);
            setCurrentMenu(null);
        } finally {
            setDeleteLoading(false); // 🔥 Stop loading
        }
    };

    const getMealIcon = (mealType) => {
        const icons = {
            Breakfast: '🌅',
            Lunch: '☀️',
            Dinner: '🌙'
        };
        return icons[mealType] || '🍽️';
    };

    const getDishTypeColor = (type) => {
        return type === 'Veg' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
    };

    const getMenuTypeBadge = (type) => {
        return type === 'Pure-Veg'
            ? 'bg-green-500 text-white'
            : 'bg-third text-white';
    };

    if (!menus || menus.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4">
                <Utensils className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No menus available</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
            {/* Delete Confirmation Dialog */}
            {showDeleteConfirm && currentMenu && (
                <div className="fixed inset-0 bg-gray-600/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all">
                        <div className="flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
                            Delete Menu?
                        </h3>

                        <p className="text-gray-600 text-center mb-2">
                            Are you sure you want to delete
                        </p>

                        <p className="text-lg font-bold text-primary text-center mb-6">
                            "{currentMenu.menuName}"
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    if (!deleteLoading) {
                                        setShowDeleteConfirm(false);
                                        setCurrentMenu(null);
                                    }
                                }}
                                className="flex-1 bg-gray-100 text-gray-700 py-3.5 px-4 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                disabled={deleteLoading}
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className={`flex-1 bg-red-500 text-white py-3.5 px-4 rounded-xl font-bold transition-all
                                    ${deleteLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-red-600"}`}
                                disabled={deleteLoading}
                            >
                                {deleteLoading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Menus List */}
            {menus.map((menu) => (
                <div
                    key={menu._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                    {/* Menu Header */}
                    <div className="bg-linear-to-br from-primary to-secondary p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex-1">
                                <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                    {menu.menuName}
                                </h2>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getMenuTypeBadge(menu.menuType)}`}>
                                    {menu.menuType}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => navigate(`/menu/update/${menu._id}`)}
                                    className="flex items-center gap-2 bg-white text-third px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-md"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                    onClick={() => handleDeleteClick(menu)}
                                    className="flex items-center gap-2 bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors font-medium shadow-md"
                                >
                                    <Trash2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Delete</span>
                                </button>
                            </div>
                        </div>

                        {/* Toggle Button */}
                        <button
                            onClick={() => toggleMenu(menu._id)}
                            className="mt-4 flex items-center gap-2 text-white hover:text-gray-100 transition-colors"
                        >
                            {expandedMenus[menu._id] ? (
                                <>
                                    <ChevronUp className="w-5 h-5" />
                                    <span className="text-sm font-medium">Hide Weekly Menu</span>
                                </>
                            ) : (
                                <>
                                    <ChevronDown className="w-5 h-5" />
                                    <span className="text-sm font-medium">View Weekly Menu</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Week Content */}
                    {expandedMenus[menu._id] && (
                        <div className="p-4 sm:p-6 bg-gray-50">
                            <div className="space-y-3">
                                {menu.week.map((dayData, index) => {
                                    const dayKey = `${menu._id}-${dayData.day}`;
                                    const isExpanded = expandedDays[dayKey];
                                    const hasMeals = Object.values(dayData.meals || {}).some(
                                        mealArray => mealArray && mealArray.length > 0
                                    );

                                    return (
                                        <div
                                            key={index}
                                            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                                        >
                                            {/* Day Header */}
                                            <button
                                                onClick={() => toggleDay(menu._id, dayData.day)}
                                                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Calendar className="w-5 h-5 text-third" />
                                                    <span className="font-semibold text-gray-800 text-lg">
                                                        {dayData.day}
                                                    </span>
                                                    {!hasMeals && (
                                                        <span className="text-xs text-gray-400 italic">No meals</span>
                                                    )}
                                                </div>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </button>

                                            {/* Day Content */}
                                            {isExpanded && (
                                                <div className="px-4 pb-4 space-y-4">
                                                    {['Breakfast', 'Lunch', 'Dinner'].map((mealType) => {
                                                        const dishes = dayData.meals?.[mealType] || [];
                                                        if (dishes.length === 0) return null;

                                                        return (
                                                            <div key={mealType} className="border-t pt-3">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <span className="text-2xl">{getMealIcon(mealType)}</span>
                                                                    <h4 className="font-semibold text-gray-700">{mealType}</h4>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {dishes.map((dish, dishIndex) => (
                                                                        <div
                                                                            key={dishIndex}
                                                                            className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200"
                                                                        >
                                                                            <span className="text-sm text-gray-800">{dish.name}</span>
                                                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getDishTypeColor(dish.type)}`}>
                                                                                {dish.type}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}

                                                    {/* Day Note */}
                                                    {dayData.note && (
                                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                                                            <p className="text-sm text-yellow-800">
                                                                <span className="font-semibold">Note: </span>
                                                                {dayData.note}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MenuDisplay;