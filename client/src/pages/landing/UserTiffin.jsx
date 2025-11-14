import React, { useEffect, useState } from 'react';
import { Leaf, Drumstick, ChefHat } from 'lucide-react';
import axiosClient from '../../services/axiosClient';
import { RippleLoader } from '../../ui/Loader';

const UserTiffin = () => {
    // Multiple menu data - different types

    const [loading, setLoading] = useState(false);
    const [allMenus, setAllMenus] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState(0);
    const [activeDay, setActiveDay] = useState(0);
    const currentMenu = allMenus[selectedMenu];
    const currentDay = currentMenu?.week[activeDay];

    useEffect(() => {
        const fetchTiffinMenu = async () => {
            try {
                setLoading(true)
                const response = await axiosClient.get('api/v1/menu/all')
                console.log("Fetched tiffin menu:", response);
                setAllMenus(response.data.data);
            } catch (error) {
                console.error("Error fetching tiffin menu:", error);
            } finally {
                setLoading(false)
            }
        }
        fetchTiffinMenu();
    }, [])
    if (loading) {
        return (
            <>
                <div className='flex flex-col items-center justify-center h-screen'>
                    <RippleLoader size={60} color="#e7582e" />
                </div>
            </>
        );
    }

    const DishBadge = ({ dish }) => (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-third/20 bg-white hover:scale-[1.03] hover:shadow-md transition-all duration-200 mb-2 mr-2">
            <div className={`w-2 h-2 rounded-full ${dish.type === 'Veg' ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className="text-sm text-third font-medium">{dish.name}</span>
        </div>
    );

    const MealSection = ({ title, dishes }) => (
        <div className="mb-6">
            <h3 className="text-lg font-bold text-third mb-3 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-third/60">({dishes?.length} items)</span>
            </h3>
            <div className="flex flex-wrap">
                {dishes?.map((dish, idx) => (
                    <DishBadge key={idx} dish={dish} />
                ))}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-teal-50 p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                {/* Menu Type Selector */}
                <div className="mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <ChefHat className="w-6 h-6 text-primary" />
                        <h2 className="text-xl font-bold text-third">Choose Your Menu</h2>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3">
                        {allMenus && allMenus?.map((menu, idx) => (
                            <button
                                key={idx}
                                onClick={() => {
                                    setSelectedMenu(idx);
                                    setActiveDay(0);
                                }}
                                className={`px-4 sm:px-6 py-3 rounded-xl font-semibold text-sm sm:text-base transition-all duration-300 ${selectedMenu === idx
                                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105"
                                    : "bg-white text-third border-2 border-third/20 hover:border-primary/50 hover:shadow-md"
                                    }`}
                            >
                                {menu?.menuName}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Header */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-4xl sm:text-4xl py-3 font-bold   bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {currentMenu?.menuName}
                    </h1>
                    <div className="flex justify-center gap-3 mb-4">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold text-sm ${currentMenu?.menuType === "Pure-Veg"
                            ? "bg-green-100 text-green-700 border-2 border-green-300"
                            : "bg-primary/10 text-primary border-2 border-primary/30"
                            }`}>
                            {currentMenu?.menuType === "Pure-Veg" ? <Leaf className="w-4 h-4" /> : <Drumstick className="w-4 h-4" />}
                            {currentMenu?.menuType}
                        </span>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full" />
                </div>

                {/* Day Tabs */}
                <div className="mb-8 overflow-x-auto pb-2">
                    <div className="flex gap-2 sm:gap-3 min-w-max sm:min-w-0 sm:justify-center px-2">
                        {currentMenu?.week?.map((day, idx) => (
                            <button
                                key={idx}
                                onClick={() => setActiveDay(idx)}
                                className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 whitespace-nowrap ${activeDay === idx
                                    ? "bg-primary text-white shadow-lg scale-105"
                                    : "bg-third/10 text-third hover:bg-third/20"
                                    }`}
                            >
                                {day.day}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Content */}
                <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-10 border border-third/10">
                    <div className="mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
                            {currentDay?.day}'s Menu
                        </h2>
                        <div className="w-16 h-1 bg-secondary rounded-full" />
                    </div>

                    {/* Meals */}
                    <div className="space-y-6">
                        <MealSection title="🌅 Breakfast" dishes={currentDay?.meals?.Breakfast} />
                        <div className="border-t border-third/10 pt-6">
                            <MealSection title="☀️ Lunch" dishes={currentDay?.meals?.Lunch} />
                        </div>
                        <div className="border-t border-third/10 pt-6">
                            <MealSection title="🌙 Dinner" dishes={currentDay?.meals?.Dinner} />
                        </div>
                    </div>

                    {/* Note */}
                    {currentDay?.note && (
                        <div className="mt-8 bg-secondary/10 border-l-4 border-secondary rounded-r-xl p-4">
                            <p className="text-third font-medium flex items-start gap-2">
                                <span className="text-secondary text-xl">💡</span>
                                <span>{currentDay?.note}</span>
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer Legend */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center gap-6 bg-white px-6 py-3 rounded-full shadow-md border border-third/10">
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            <span className="text-sm text-third font-medium">Vegetarian</span>
                        </div>
                        <div className="w-px h-4 bg-third/20" />
                        <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            <span className="text-sm text-third font-medium">Non-Vegetarian</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @media (max-width: 640px) {
          .overflow-x-auto::-webkit-scrollbar {
            height: 4px;
          }
          .overflow-x-auto::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
          }
          .overflow-x-auto::-webkit-scrollbar-thumb {
            background: #e7582e;
            border-radius: 10px;
          }
        }
      `}</style>
        </div>
    );
};

export default UserTiffin;