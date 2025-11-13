import React, { useState } from 'react';
import { Trash2, Edit2, ChevronDown, ChevronUp, Calendar, Utensils } from 'lucide-react';

const TiffinMenuDisplay = ({ menus, onEdit, onDelete }) => {
    const [expandedMenus, setExpandedMenus] = useState({});
    const [expandedDays, setExpandedDays] = useState({});

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
            : 'bg-orange-500 text-white';
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
            {menus.map((menu) => (
                <div
                    key={menu._id}
                    className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                    {/* Menu Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-4 sm:p-6">
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
                                    onClick={() => onEdit(menu)}
                                    className="flex items-center gap-2 bg-white text-third px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors font-medium shadow-md"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span className="hidden sm:inline">Edit</span>
                                </button>
                                <button
                                    onClick={() => onDelete(menu._id)}
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

// Example usage with sample data
const Menu = () => {
    const [menus, setMenus] = useState([
        {
            _id: '1',
            menuName: 'North Indian Weekly Special',
            menuType: 'Includes-Non-Veg',
            week: [
                {
                    day: 'Monday',
                    meals: {
                        Breakfast: [
                            { name: 'Aloo Paratha', type: 'Veg' },
                            { name: 'Curd', type: 'Veg' }
                        ],
                        Lunch: [
                            { name: 'Dal Tadka', type: 'Veg' },
                            { name: 'Jeera Rice', type: 'Veg' },
                            { name: 'Roti', type: 'Veg' }
                        ],
                        Dinner: [
                            { name: 'Chicken Curry', type: 'Non-Veg' },
                            { name: 'Naan', type: 'Veg' }
                        ]
                    },
                    note: 'Extra spicy on request'
                },
                {
                    day: 'Tuesday',
                    meals: {
                        Breakfast: [
                            { name: 'Poha', type: 'Veg' }
                        ],
                        Lunch: [
                            { name: 'Rajma', type: 'Veg' },
                            { name: 'Rice', type: 'Veg' }
                        ],
                        Dinner: [
                            { name: 'Paneer Tikka', type: 'Veg' },
                            { name: 'Roti', type: 'Veg' }
                        ]
                    }
                }
            ]
        },
        {
            _id: '2',
            menuName: 'Pure Vegetarian Deluxe',
            menuType: 'Pure-Veg',
            week: [
                {
                    day: 'Monday',
                    meals: {
                        Breakfast: [
                            { name: 'Idli', type: 'Veg' },
                            { name: 'Sambar', type: 'Veg' }
                        ],
                        Lunch: [
                            { name: 'Chole', type: 'Veg' },
                            { name: 'Bhature', type: 'Veg' }
                        ],
                        Dinner: [
                            { name: 'Palak Paneer', type: 'Veg' },
                            { name: 'Roti', type: 'Veg' }
                        ]
                    }
                }
            ]
        }
    ]);

    const handleEdit = (menu) => {
        console.log('Edit menu:', menu);
        alert(`Editing: ${menu.menuName}`);
        // Implement your edit logic here
    };

    const handleDelete = (menuId) => {
        if (window.confirm('Are you sure you want to delete this menu?')) {
            setMenus(menus.filter(m => m._id !== menuId));
            console.log('Deleted menu:', menuId);
            // Implement your delete API call here
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <div className="max-w-6xl mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-third mb-2">Tiffin Menus</h1>
                    <p className="text-gray-600">Manage your weekly meal plans</p>
                </div>

                <TiffinMenuDisplay
                    menus={menus}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>
        </div>
    );
};

export default Menu;