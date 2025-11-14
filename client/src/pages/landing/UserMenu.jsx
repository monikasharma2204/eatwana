import React, { useState, useMemo, useEffect } from 'react';
import { Search, Star, Leaf, Drumstick, Egg } from 'lucide-react';
import TiffinCard from '../../components/landing/TiffinCard';
import DishCard from '../../components/landing/DishCard';
import FilterBar from '../../components/landing/FilterBar';
import axiosClient from '../../services/axiosClient';
import { RippleLoader } from '../../ui/Loader';

// Main Menu Page Component
const UserMenu = () => {
    const [tiffins, setTiffins] = useState([]);
    const [dishes, setDishes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [foodFilter, setFoodFilter] = useState('all');
    const [mealFilter, setMealFilter] = useState('all');
    const [loading, setLoading] = useState(false);

    const fetchTiffins = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/api/v1/tiffin/all");
            console.log('Tiffins:', response.data.data);
            // Filter only active tiffins
            const activeTiffins = response.data.data.filter(t => t.status === 'active');
            setTiffins(activeTiffins);
        } catch (error) {
            console.log('Error fetching tiffins:', error);
        } finally {
            setLoading(false);
        }
    }

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/api/v1/dishes/all");
            console.log('Dishes:', response.data.data);
            // Filter only available dishes
            const availableDishes = response.data.data.filter(d => d.isAvailable);
            setDishes(availableDishes);
        } catch (error) {
            console.log('Error fetching dishes:', error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchTiffins();
        fetchDishes();
    }, []);

    const filteredItems = useMemo(() => {
        let filteredDishes = [...dishes];
        let filteredTiffins = [...tiffins];

        // Search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();

            filteredDishes = filteredDishes.filter(dish =>
                dish.name.toLowerCase().includes(searchLower) ||
                dish.description.toLowerCase().includes(searchLower) ||
                dish.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                (dish.searchTerms && dish.searchTerms.toLowerCase().includes(searchLower))
            );

            filteredTiffins = filteredTiffins.filter(tiffin =>
                tiffin.name.toLowerCase().includes(searchLower) ||
                tiffin.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
                (tiffin.menu && tiffin.menu.menuName.toLowerCase().includes(searchLower))
            );
        }

        // Food type filter
        if (foodFilter !== 'all') {
            filteredDishes = filteredDishes.filter(dish => dish.category === foodFilter);
            filteredTiffins = filteredTiffins.filter(tiffin => tiffin.foodType === foodFilter);
        }

        // Meal type filter
        if (mealFilter === 'tiffin') {
            filteredDishes = [];
        } else if (mealFilter !== 'all') {
            filteredDishes = filteredDishes.filter(dish => dish.mealType === mealFilter);
            filteredTiffins = [];
        }

        return { dishes: filteredDishes, tiffins: filteredTiffins };
    }, [dishes, tiffins, searchTerm, foodFilter, mealFilter]);

    if (loading) {
        return (
            <div className='flex flex-col items-center justify-center h-screen'>
                <RippleLoader size={60} color='#e7582e' />
                <div className='text-third font-semibold'>Loading....</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Our Menu
                        </span>
                    </h1>
                    <p className="text-gray-600 text-lg">Delicious food delivered to your doorstep</p>
                </div>

                {/* Filter Bar */}
                <FilterBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    foodFilter={foodFilter}
                    setFoodFilter={setFoodFilter}
                    mealFilter={mealFilter}
                    setMealFilter={setMealFilter}
                />

                {/* Results Count */}
                <div className="mb-6">
                    <p className="text-third font-medium">
                        Found {filteredItems.dishes.length} dishes and {filteredItems.tiffins.length} tiffin plans
                    </p>
                </div>

                {/* Dishes Grid */}
                {filteredItems.dishes.length > 0 && (
                    <div className="mb-12">
                        <h2 className="text-2xl font-bold text-third mb-6">Dishes</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredItems.dishes.map(dish => (
                                <DishCard key={dish._id} dish={dish} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Tiffins Grid */}
                {filteredItems.tiffins.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-third mb-6">Tiffin Services</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredItems.tiffins.map(tiffin => (
                                <TiffinCard key={tiffin._id} tiffin={tiffin} />
                            ))}
                        </div>
                    </div>
                )}

                {/* No Results */}
                {filteredItems.dishes.length === 0 && filteredItems.tiffins.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-xl text-gray-500">No items found matching your filters</p>
                        <p className="text-gray-400 mt-2">Try adjusting your search or filters</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserMenu;