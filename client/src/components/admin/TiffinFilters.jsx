
import React from 'react';
import { Star, Leaf, Drumstick, Egg, IndianRupee, Pencil, Trash2, Clock, Calendar, ChevronDown, ChevronUp } from 'lucide-react';

const TiffinFilter = ({ selectedFilter, onFilterChange }) => {
    const getFoodTypeIcon = (type) => {
        switch (type) {
            case 'veg':
                return <Leaf className="w-5 h-5 text-green-600" />;
            case 'non-veg':
                return <Drumstick className="w-5 h-5 text-red-600" />;
            case 'egg':
                return <Egg className="w-5 h-5 text-yellow-600" />;
            default:
                return null;
        }
    };

    const getFoodTypeLabel = (type) => {
        return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    return (
        <div className="flex flex-wrap gap-3 justify-center mb-8">
            {['all', 'veg', 'non-veg', 'egg'].map(filter => (
                <button
                    key={filter}
                    onClick={() => onFilterChange(filter)}
                    className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${selectedFilter === filter
                        ? 'bg-orange-500 text-white shadow-lg scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                        }`}
                >
                    {filter !== 'all' && getFoodTypeIcon(filter)}
                    {filter === 'all' ? 'All Tiffins' : getFoodTypeLabel(filter)}
                </button>
            ))}
        </div>
    );
};

export default TiffinFilter;