
import React, { useState } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import AlertSnackbar from '../../ui/AlertSnackbar';
import axiosClient from '../../services/axiosClient';

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

export default function TiffinMenuForm() {
    const [menuName, setMenuName] = useState('');
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "info",
    });

    const [week, setWeek] = useState(
        DAYS.map(day => ({
            day,
            meals: {
                Breakfast: [],
                Lunch: [],
                Dinner: []
            },
            note: ''
        }))
    );

    const showSnackbar = (message, severity = "info") => {
        setSnackbar({ open: true, message, severity });
    };

    const handleClose = () => {
        setSnackbar((prev) => ({ ...prev, open: false }));
    };

    const addDish = (dayIndex, mealType) => {
        const newWeek = [...week];
        newWeek[dayIndex].meals[mealType].push({ name: '', type: 'Veg' });
        setWeek(newWeek);
    };

    const removeDish = (dayIndex, mealType, dishIndex) => {
        const newWeek = [...week];
        newWeek[dayIndex].meals[mealType].splice(dishIndex, 1);
        setWeek(newWeek);
    };

    const updateDish = (dayIndex, mealType, dishIndex, field, value) => {
        const newWeek = [...week];
        newWeek[dayIndex].meals[mealType][dishIndex][field] = value;
        setWeek(newWeek);
    };

    const updateNote = (dayIndex, value) => {
        const newWeek = [...week];
        newWeek[dayIndex].note = value;
        setWeek(newWeek);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // -------------------------------
        // Frontend Validation
        // -------------------------------
        if (!menuName.trim()) {
            showSnackbar('Please enter a menu name', 'error');
            return;
        }

        const hasAtLeastOneDish = week.some(day =>
            Object.values(day.meals).some(meals => meals.length > 0)
        );

        if (!hasAtLeastOneDish) {
            showSnackbar('Please add at least one dish to the menu', 'error');
            return;
        }

        const emptyDishes = week.some(day =>
            Object.values(day.meals).some(meals =>
                meals.some(dish => !dish.name.trim())
            )
        );

        if (emptyDishes) {
            showSnackbar('Please fill in all dish names or remove empty dishes', 'error');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosClient.post('/api/v1/menu/add', {
                menuName,
                week
            });

            // Axios stores response in response.data
            const data = response.data;
console.log(response)
            if (data.success) {
                showSnackbar(data.message || 'Menu created successfully!', 'success');

                // Reset form
                setMenuName('');
                setWeek(
                    DAYS.map(day => ({
                        day,
                        meals: { Breakfast: [], Lunch: [], Dinner: [] },
                        note: ''
                    }))
                );
            } else {
                // Backend may send failed success:false with message
                showSnackbar(data.message || 'Failed to create menu', 'error');
            }
        } catch (error) {
            // -------------------------------
            // Backend Validation or Server Errors
            // -------------------------------
            console.log(error);
            if (error.response) {
                // Server responded with an error status code (400/404/500)
                const backendMessage =
                    error.response.data?.message ||
                    error.response.data?.error ||
                    'Something went wrong';

                showSnackbar(backendMessage, 'error');
            } else {
                // Network failure
                showSnackbar('Network error. Please try again.', 'error');
            }
        } finally {
            setLoading(false);
        }
    };


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
            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-teal-50 p-4 md:p-8">
                <div className="max-w-7xl mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Menu Name Card */}
                        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-primary/20">
                            <label className="block text-lg font-semibold text-gray-800 mb-3">
                                Menu Name
                            </label>
                            <input
                                type="text"
                                value={menuName}
                                onChange={(e) => setMenuName(e.target.value)}
                                placeholder="e.g., Winter Special Menu, Healthy Week Plan"
                                className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                            />
                        </div>

                        {/* Bento Grid for Days */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-4">
                            {week.map((dayData, dayIndex) => (
                                <div
                                    key={dayData.day}
                                    className={`bg-white rounded-2xl shadow-lg p-5 border-2 border-gray-100 hover:border-primary/30 transition-all ${dayIndex === 0 ? 'md:col-span-2 lg:col-span-1' : ''
                                        }`}
                                >
                                    <h2 className="text-xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary/20">
                                        {dayData.day}
                                    </h2>

                                    {/* Meals */}
                                    <div className="space-y-4 mb-4">
                                        {MEAL_TYPES.map((mealType) => (
                                            <div key={mealType} className="bg-gray-50 rounded-lg p-3">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="font-semibold text-gray-700 text-sm">{mealType}</h3>
                                                    <button
                                                        type="button"
                                                        onClick={() => addDish(dayIndex, mealType)}
                                                        className="text-primary hover:text-secondary transition-colors"
                                                    >
                                                        <Plus size={18} />
                                                    </button>
                                                </div>

                                                <div className="space-y-2">
                                                    {dayData.meals[mealType].map((dish, dishIndex) => (
                                                        <div key={dishIndex} className="flex gap-2">
                                                            <input
                                                                type="text"
                                                                value={dish.name}
                                                                onChange={(e) => updateDish(dayIndex, mealType, dishIndex, 'name', e.target.value)}
                                                                placeholder="Dish name"
                                                                className="flex-1 px-3 py-2 text-sm rounded border border-gray-200 focus:border-primary focus:outline-none"
                                                            />
                                                            <select
                                                                value={dish.type}
                                                                onChange={(e) => updateDish(dayIndex, mealType, dishIndex, 'type', e.target.value)}
                                                                className="px-2 py-2 text-sm rounded border border-gray-200 focus:border-primary focus:outline-none"
                                                            >
                                                                <option value="Veg">Veg</option>
                                                                <option value="Non-Veg">Non-Veg</option>
                                                            </select>
                                                            <button
                                                                type="button"
                                                                onClick={() => removeDish(dayIndex, mealType, dishIndex)}
                                                                className="text-red-500 hover:text-red-700 transition-colors"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Note */}
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">
                                            Note (Optional)
                                        </label>
                                        <textarea
                                            value={dayData.note}
                                            onChange={(e) => updateNote(dayIndex, e.target.value)}
                                            placeholder="Add special instructions..."
                                            rows="2"
                                            className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-primary focus:outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-center pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-primary hover:bg-secondary text-white font-semibold px-12 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Creating Menu...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} />
                                        Create Menu
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

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
        </>
    );
}