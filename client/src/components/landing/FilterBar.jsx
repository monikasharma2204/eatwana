
import { Search, Leaf, Drumstick, Egg } from 'lucide-react';

const FilterBar = ({ searchTerm, setSearchTerm, foodFilter, setFoodFilter, mealFilter, setMealFilter }) => {
    const foodOptions = [
        { value: 'all', label: 'All', icon: null },
        { value: 'veg', label: 'Veg', icon: Leaf },
        { value: 'non-veg', label: 'Non-Veg', icon: Drumstick },
        { value: 'egg', label: 'Egg', icon: Egg }
    ];

    const mealOptions = [
        { value: 'all', label: 'All' },
        { value: 'normal', label: 'Normal' },
        { value: 'special', label: 'Special' },
        { value: 'gym', label: 'Gym' },
        { value: 'tiffin', label: 'Tiffin' }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-third/10">
            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-third/50 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search dishes, tiffins, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 rounded-lg border border-third/20 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                />
            </div>

            {/* Food Type Filter */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-third mb-3">Food Type</h3>
                <div className="flex flex-wrap gap-2">
                    {foodOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                            <button
                                key={option.value}
                                onClick={() => setFoodFilter(option.value)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${foodFilter === option.value
                                    ? 'bg-linear-to-r from-primary to-secondary text-white shadow-md'
                                    : 'bg-third/10 text-third hover:bg-third/20'
                                    }`}
                            >
                                {Icon && <Icon className="w-4 h-4" />}
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Meal Type Filter */}
            <div>
                <h3 className="text-sm font-semibold text-third mb-3">Meal Type</h3>
                <div className="flex flex-wrap gap-2">
                    {mealOptions.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => setMealFilter(option.value)}
                            className={`px-4 py-2 rounded-full font-medium transition-all duration-300 ${mealFilter === option.value
                                ? 'bg-linear-to-r from-primary to-secondary text-white shadow-md'
                                : 'bg-third/10 text-third hover:bg-third/20'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;